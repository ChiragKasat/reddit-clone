import { Post } from 'src/entities/Post';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

@Resolver(Post)
export class PostResolver {
	@Query(() => [Post])
	async posts(): Promise<Post[]> {
		return Post.find();
	}

	@Query(() => Post, { nullable: true })
	async post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post)
	async createPost(@Arg('title') title: string): Promise<Post> {
		return Post.create({ title }).save();
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string
	): Promise<Post | null> {
		const post = await Post.findOne(id);

		if (!post) {
			return null;
		}

		await Post.update({ id }, { title });

		return post;
	}

	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Post.delete(id);
		return true;
	}
}
