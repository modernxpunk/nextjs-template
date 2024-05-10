import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";

const posts = [
	{
		id: "1",
		title: "Hello, World!",
	},
];

const postRouter = router({
	getAll: publicProcedure.query(async () => {
		return posts;
	}),
	getById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async (opts) => {
			const id = opts.input.id;
			return posts.find((post) => post.id === id);
		}),
	create: publicProcedure
		.input(
			z.object({
				title: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const newPost = opts.input;
			posts.push({
				id: String(posts.length + 1),
				...newPost,
			});
			return newPost;
		}),
	updateById: publicProcedure
		.input(
			z.object({
				id: z.string(),
				updatedPost: z.object({
					title: z.string(),
				}),
			}),
		)
		.mutation(async (opts) => {
			const { id, updatedPost } = opts.input;
			const post = posts.find((post) => post.id === id);
			if (!post) {
				throw new Error("Post not found");
			}
			Object.assign(post, updatedPost);
			return post;
		}),
	deleteById: publicProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async (opts) => {
			const id = opts.input.id;
			const index = posts.findIndex((post) => post.id === id);
			if (index === -1) {
				throw new Error("Post not found");
			}
			const deletedPost = posts[index];
			posts.splice(index, 1);
			return deletedPost;
		}),
});

export default postRouter;
