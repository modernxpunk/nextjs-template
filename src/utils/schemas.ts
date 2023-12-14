import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;

const resolver = zodResolver;
export { resolver };

export { createUserSchema };
export type { CreateUserSchema };
