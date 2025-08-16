import { authed } from "@/lib/api/access";
import z from "zod";
import {
	InputInsertItemSchema,
	OutputItemSchema,
	OutputInsertItemSchema,
} from "@/lib/api/schemas/items";

export const insertItem = authed
	.route({
		method: "POST",
		path: "/items",
		summary: "Add an item",
		tags: ["Items"],
	})
	.input(InputInsertItemSchema)
	.output(OutputInsertItemSchema)
	.handler(async ({ input, context }) => {
		const { name } = input;
		const newItem = await context.db.item.create({
			data: {
				name,
				user: {
					connect: { id: context.user?.id },
				},
			},
			select: {
				id: true,
				name: true,
			},
		});
		return newItem;
	});

export const listItems = authed
	.route({
		method: "GET",
		path: "/items",
		summary: "List all items",
		tags: ["Items"],
	})
	.output(z.array(OutputItemSchema))
	.handler(async ({ context }) => {
		const items = await context.db.item.findMany({
			select: {
				id: true,
				name: true,
			},
		});
		return items;
	});
