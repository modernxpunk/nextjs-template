import { publicProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { db } from "@/server/.drizzle/connection";
import { postsTable } from "@/server/.drizzle/schema";
import { asc, eq } from "drizzle-orm";

const postRouter = router({
	getAll: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).optional().default(10),
				page: z.number().optional().default(1),
				cursor: z.any().nullish(),
				direction: z.enum(["asc", "desc"]).optional().default("asc"),
			}),
		)
		.query(async (opts) => {
			const { page, direction, cursor } = opts.input;
			const limit = opts.input.limit ?? 10;

			const posts = await db
				.select()
				.from(postsTable)
				.orderBy(asc(postsTable.id))
				.limit(limit)
				.offset((page - 1) * limit);

			const nextPage = posts.length !== limit ? null : page + 1;
			const previousPage = page === 1 ? null : page - 1;

			return { posts, nextPage, previousPage };
		}),
	get: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async (opts) => {
			const { id } = opts.input;
			const post = await db
				.select()
				.from(postsTable)
				.where(eq(postsTable.id, id));
			return post;
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
	update: publicProcedure
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
	delete: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async (opts) => {
			const { id } = opts.input;
			await db.delete(postsTable).where(eq(postsTable.id, id));
			return id;
		}),
});

export default postRouter;
