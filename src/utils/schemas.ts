import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
	password: z.string().min(1, { message: "Password is required" }),
});

const signUpSchema = z
	.object({
		email: z.string().min(1, { message: "Email is required" }).email({
			message: "Must be a valid email",
		}),
		username: z.string().min(1, { message: "Username is required" }),
		password: z.string().min(1, { message: "Password is required" }),
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm Password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password don't match",
	});

const forgotPasswordSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
});

const createUserSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.string().min(1, { message: "Email is required" }).email({
		message: "Must be a valid email",
	}),
});

type SignInSchema = z.infer<typeof signInSchema>;
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
type SignUpSchema = z.infer<typeof signUpSchema>;
type CreateUserSchema = z.infer<typeof createUserSchema>;

const resolver = zodResolver;
export { resolver };

// Schemas
export { signInSchema, signUpSchema, createUserSchema, forgotPasswordSchema };

// Types
export type {
	SignInSchema,
	SignUpSchema,
	CreateUserSchema,
	ForgotPasswordSchema,
};
