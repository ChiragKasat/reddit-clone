import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { InfoResolver } from './resolvers/info';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
	await createConnection({
		type: 'postgres',
		url: process.env.DB_URI,
		synchronize: !__prod__,
		logging: !__prod__,
		entities: [Post, User]
	});

	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	app.use(
		session({
			name: 'hsct',
			store: new RedisStore({
				client: redisClient,
				disableTouch: true
			}),
			secret: process.env.REDIS_SECRET || 'ywtfdgiwncpogyokwb',
			resave: false,
			cookie: {
				sameSite: 'lax',
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
				secure: __prod__
			},
			saveUninitialized: false
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [InfoResolver, PostResolver, UserResolver],
			validate: false
		}),
		context: ({ req, res }): MyContext => ({ req, res })
	});

	apolloServer.applyMiddleware({ app });

	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => {
		console.log(`server started on port ${PORT}`);
	});
};

main().catch(err => console.error(err));
