import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	password: z.string().min(1, { message: "Password is required" }),
});

const createUserSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
});

type SignInSchema = z.infer<typeof signInSchema>;
type CreateUserSchema = z.infer<typeof createUserSchema>;

const resolver = zodResolver;
export { resolver };

// Schemas
export { signInSchema, createUserSchema };

// Types
export type { SignInSchema, CreateUserSchema };
