import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/server/.drizzle/connection";
import { postsTable } from "@/server/.drizzle/schema";
import { eq } from "drizzle-orm";

const postRouter = router({
	getAll: publicProcedure.query(async () => {
		const posts = await db.select().from(postsTable);
		return posts;
	}),
	getById: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async (opts) => {
			const id = opts.input.id;
			const posts = await db
				.select()
				.from(postsTable)
				.where(eq(postsTable.id, id));
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
			await db.insert(postsTable).values({ title: newPost.title });
			return newPost;
		}),
	updateById: publicProcedure
		.input(
			z.object({
				id: z.number(),
				updatedPost: z.object({
					title: z.string(),
				}),
			}),
		)
		.mutation(async (opts) => {
			const { id, updatedPost } = opts.input;
			await db.update(postsTable).set(updatedPost).where(eq(postsTable.id, id));
			return updatedPost;
		}),
	deleteById: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async (opts) => {
			const id = opts.input.id;
			await db.delete(postsTable).where(eq(postsTable.id, id));
			return id;
		}),
});

export default postRouter;
