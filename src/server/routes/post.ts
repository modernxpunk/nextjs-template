import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { eq, gt } from "drizzle-orm";
import { db } from "drizzle/db";
import { posts, insertPostSchema, selectPostSchema } from "drizzle/schema";
import z from "zod";

const postRouter = router({
	infinitePosts: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				description: "description",
				path: "/get-all",
				tags: ["posts"],
				summary: "Summary",
				protect: true,
			},
		})
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.number().nullish(),
			}),
		)
		.query(async (opts) => {
			const { input } = opts;
			const limit = input.limit ?? 50;
			const { cursor } = input;

			const postsItems = await db
				.select()
				.from(posts)
				.orderBy(posts.id)
				.limit(limit)
				.where(gt(posts.id, cursor || 1));

			return {
				postsItems,
				nextCursor: postsItems.at(-1)?.id,
			};
		}),

	getById: publicProcedure
		.input(selectPostSchema.pick({ id: true }))
		.query(async (opts) => {
			const post = await db.query.posts.findFirst({
				where: eq(posts.id, opts.input.id),
			});
			return post;
		}),

	createPost: protectedProcedure
		.input(insertPostSchema)
		.mutation(async (opts) => {
			const post = await db.insert(posts).values(opts.input);
			return post;
		}),

	editById: protectedProcedure
		.input(
			z.object({
				id: selectPostSchema.pick({ id: true }),
				data: selectPostSchema,
			}),
		)
		.mutation(async (opts) => {
			const editedposts = await db
				.update(posts)
				.set(opts.input.data)
				.where(eq(posts.id, +opts.input.id))
				.returning();
			const editedpost = editedposts[0];
			return editedpost;
		}),

	deleteById: protectedProcedure
		.input(selectPostSchema.pick({ id: true }))
		.mutation(async (opts) => {
			const deletedposts = await db
				.delete(posts)
				.where(eq(posts.id, opts.input.id))
				.returning();
			const deletedpost = deletedposts[0];
			return deletedpost;
		}),
});

export default postRouter;
