"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";

const schemaSignIn = z.object({
	email: z.string(), // .min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z.string(), // .min(6, { message: 'Password must be at least 6 characters long' }),
	rememberMe: z.boolean().optional(),
});

type SignInSchema = z.infer<typeof schemaSignIn>;

const SignInForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<SignInSchema>({
		resolver: zodResolver(schemaSignIn),
	});

	const onSubmit = async ({ email, password, rememberMe }: SignInSchema) => {
		const signInResponse = await signIn.email({
			email: email,
			password: password,
			rememberMe: rememberMe,
			callbackURL: "/",
		});
		if (signInResponse.error) {
			setError("root", {
				message: signInResponse.error.message,
			});
		}
	};

	return (
		<form className="gap-2 form-control" onSubmit={handleSubmit(onSubmit)}>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Email</legend>
				<input
					type="text"
					className={cn("w-full input", errors.root && "input-error")}
					placeholder="email"
					{...register("email")}
				/>
				{errors.email && (
					<span className="text-error">{errors.email.message}</span>
				)}
			</fieldset>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Password</legend>
				<input
					type="text"
					className={cn("w-full input", errors.password && "input-error")}
					placeholder="password"
					{...register("password")}
				/>
				{errors.password && (
					<span className="text-error">{errors.password.message}</span>
				)}
			</fieldset>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Remember me</legend>
				<input
					type="checkbox"
					className="checkbox"
					{...register("rememberMe")}
				/>
				{errors.rememberMe && (
					<span className="error">{errors.rememberMe.message}</span>
				)}
			</fieldset>
			<button
				className={cn("btn", errors.root && "btn-error")}
				type="submit"
				disabled={isSubmitting}
			>
				Sign In
			</button>
			<Link href="/auth/sign-up" className="btn btn-xs">
				Sign up
			</Link>
			{errors.root && <span className="text-error">{errors.root.message}</span>}
		</form>
	);
};

export default SignInForm;
