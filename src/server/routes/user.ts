import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import z from "zod";

let users: any = [];

const userRouter = router({
	getAll: protectedProcedure.query(async () => {
		return users;
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async (opts) => {
			const id = opts.input.id;
			const user = users.find((user: any) => user.id === id);
			return user;
		}),

	createUser: publicProcedure
		.input(z.object({ user: z.any() }))
		.mutation(async (opts) => {
			const user = opts.input.user;
			users.push(user);
			return user;
		}),

	editById: publicProcedure
		.input(z.object({ id: z.string(), data: z.any() }))
		.mutation(async (opts) => {
			const user = opts.input.data;
			const indexOfEditedUser = users.findIndex(
				(user: any) => user.id === opts.input.id,
			);
			users[indexOfEditedUser] = user;
			return user;
		}),

	deleteById: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async (opts) => {
			const id = opts.input.id;
			users = users.filter((user: any) => user.id !== id);
			return id;
		}),
});

export default userRouter;
