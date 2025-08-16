import { ItemSchema } from "@zod-schema";

export const InputInsertItemSchema = ItemSchema.pick({
	name: true,
});

export const OutputInsertItemSchema = ItemSchema.pick({
	id: true,
	name: true,
});

export const OutputItemSchema = ItemSchema.pick({
	id: true,
	name: true,
});
