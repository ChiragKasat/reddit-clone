import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { InfoResolver } from './resolvers/info';
import { PostResolver } from './resolvers/post';
import { Connection, createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

const main = async () => {
	const connection: Connection = await createConnection({
		type: 'postgres',
		url: process.env.DB_URI,
		synchronize: !__prod__,
		logging: true,
		entities: [Post, User]
	});

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [InfoResolver, PostResolver],
			validate: false
		}),
		context: ({ req, res }) => ({ req, res })
	});

	app.get('/', (_, res) => {
		res.send('hello');
	});

	apolloServer.applyMiddleware({ app });

	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => {
		console.log(`server started on port ${PORT}`);
	});
};

main().catch(err => console.error(err));
