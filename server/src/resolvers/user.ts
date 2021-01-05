import { hash, verify } from 'argon2';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver
} from 'type-graphql';
import { MyContext } from 'src/types';
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;

	@Field()
	password: string;

	@Field()
	email: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver(Post)
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: MyContext): Promise<User | null> {
		console.log(req.session.userId);

		if (req.session.userId) {
			try {
				const user = await User.findOne(req.session.userId);
				if (user) {
					return user;
				}
				return null;
			} catch (err) {
				return null;
			}
		}

		return null;
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [{ field: 'username', message: 'username too short' }]
			};
		}

		if (options.password.length <= 3) {
			return {
				errors: [{ field: 'password', message: 'password too weak' }]
			};
		}

		const hashedPassword = await hash(options.password);

		try {
			const user = await User.create({
				username: options.username,
				email: options.email,
				password: hashedPassword
			}).save();

			req.session.userId = user.id;

			return { user };
		} catch (err) {
			if (err.code === '23505' || err.detail.includes('already exists')) {
				const duplicateField: string = err.detail.split(' ')[1];
				const field = duplicateField.substring(1, duplicateField.indexOf(')'));
				return {
					errors: [
						{
							field,
							message: `${field} already registered`
						}
					]
				};
			}
		}

		return { errors: [{ field: 'unkown', message: 'unknown' }] };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext
	): Promise<UserResponse> {
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return {
				errors: [{ field: 'email', message: 'email not registered' }]
			};
		}

		const valid = await verify(user.password, password);

		if (!valid) {
			return { errors: [{ field: 'password', message: 'incorrect password' }] };
		}

		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise(resolve =>
			req.session.destroy(err => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					resolve(false);
					return;
				} else {
					resolve(true);
				}
			})
		);
	}
}
