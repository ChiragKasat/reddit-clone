import { Query, Resolver } from 'type-graphql';

@Resolver()
export class InfoResolver {
	@Query(() => String)
	info() {
		return 'This is the reddit clone graphql api 😀🚀';
	}
}
