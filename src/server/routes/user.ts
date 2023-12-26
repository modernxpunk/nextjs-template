import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { users, insertUserSchema, selectUserSchema } from "drizzle/schema";
import z from "zod";

const userRouter = router({
	getAll: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				description: "description",
				path: "/get-all",
				tags: ["users"],
				summary: "Summary",
				protect: true,
			},
		})
		.input(z.undefined())
		.output(selectUserSchema.array())
		.query(async () => {
			const users = await db.query.users.findMany();
			return users;
		}),

	getById: publicProcedure
		.input(selectUserSchema.pick({ id: true }))
		.query(async (opts) => {
			const user = await db.query.users.findFirst({
				where: eq(users.id, opts.input.id),
			});
			return user;
		}),

	createUser: publicProcedure.input(insertUserSchema).mutation(async (opts) => {
		const user = await db.insert(users).values(opts.input);
		return user;
	}),

	editById: publicProcedure
		.input(
			z.object({
				id: selectUserSchema.pick({ id: true }),
				data: insertUserSchema,
			}),
		)
		.mutation(async (opts) => {
			const editedUsers = await db
				.update(users)
				.set(opts.input.data)
				.where(eq(users.id, +opts.input.id))
				.returning();
			const editedUser = editedUsers[0];
			return editedUser;
		}),

	deleteById: publicProcedure
		.input(selectUserSchema.pick({ id: true }))
		.mutation(async (opts) => {
			const deletedUsers = await db
				.delete(users)
				.where(eq(users.id, opts.input.id))
				.returning();
			const deletedUser = deletedUsers[0];
			return deletedUser;
		}),
});

export default userRouter;
