import { authed } from "@/lib/api/access";
import z from "zod";
import { OutputUserSchema } from "@/lib/api/schemas/users";

export const listUsers = authed
	.route({
		method: "GET",
		path: "/users",
		summary: "List all users",
		tags: ["Users"],
	})
	.output(z.array(OutputUserSchema))
	.handler(async ({ context }) => {
		const users = await context.db.user.findMany({
			select: {
				name: true,
				email: true,
				id: true,
			},
		});
		return users;
	});
