import { UserSchema } from "@zod-schema";

export const OutputUserSchema = UserSchema.pick({
	id: true,
	name: true,
	email: true,
});
