import { PrismaClient } from "@prisma/client";
import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import z from "zod";

const prisma = new PrismaClient();

const userRouter = router({
	getAll: protectedProcedure.query(async () => {
		const users = await prisma.user.findMany();
		return users;
	}),

	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async (opts) => {
			const id = opts.input.id;
			const user = await prisma.user.findUnique({
				where: { id: id },
			});
			return user;
		}),

	createUser: publicProcedure
		.input(z.object({ user: z.any() }))
		.mutation(async (opts) => {
			const user = opts.input.user;
			const createdUser = await prisma.user.create({
				data: user,
			});
			return createdUser;
		}),

	editById: publicProcedure
		.input(z.object({ id: z.number(), data: z.any() }))
		.mutation(async (opts) => {
			const id = opts.input.id;
			const editedUser = opts.input.data;
			const updatedUser = await prisma.user.update({
				where: {
					id: id,
				},
				// TODO: type user
				// @ts-ignore
				data: editedUser,
			});
			return updatedUser;
		}),

	deleteById: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const id = opts.input.id;
			const deletedUser = await prisma.user.delete({ where: { id: id } });
			return deletedUser;
		}),
});

export default userRouter;
