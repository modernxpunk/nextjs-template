import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import { eq } from "drizzle-orm";
import { db } from "drizzle/db";
import { UserTable, insertUserSchema, selectUserSchema } from "drizzle/schema";
import z from "zod";

const userRouter = router({
	getAll: protectedProcedure.query(async () => {
		const users = await db.query.UserTable.findMany();
		return users;
	}),

	getById: publicProcedure
		.input(selectUserSchema.pick({ id: true }))
		.query(async (opts) => {
			const user = await db.query.UserTable.findFirst({
				where: eq(UserTable.id, opts.input.id),
			});
			return user;
		}),

	createUser: publicProcedure.input(insertUserSchema).mutation(async (opts) => {
		const user = await db.insert(UserTable).values(opts.input);
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
				.update(UserTable)
				.set(opts.input.data)
				.where(eq(UserTable.id, +opts.input.id))
				.returning();
			const editedUser = editedUsers[0];
			return editedUser;
		}),

	deleteById: publicProcedure
		.input(selectUserSchema.pick({ id: true }))
		.mutation(async (opts) => {
			const deletedUsers = await db
				.delete(UserTable)
				.where(eq(UserTable.id, opts.input.id))
				.returning();
			const deletedUser = deletedUsers[0];
			return deletedUser;
		}),
});

export default userRouter;
