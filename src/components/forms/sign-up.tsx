"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schemaSignUp = z.object({
	email: z.string(), // .min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z.string(), // .min(6, { message: 'Password must be at least 6 characters long' }),
});

type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<SignUpSchema>({
		resolver: zodResolver(schemaSignUp),
	});

	const router = useRouter();

	const onSubmit = async ({ email, password }: SignUpSchema) => {
		const signUpResponse = await signUp.email({
			email: email,
			password: password,
			name: "",
			callbackURL: "/",
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
		console.log("signUpResponse", signUpResponse);
		if (signUpResponse.error) {
			setError("root", {
				message: signUpResponse.error.message,
			});
		}
	};

	return (
		<form
			className="w-full gap-2 p-6 rounded-lg shadow-md form-control max-w-96 bg-base-300"
			onSubmit={handleSubmit(onSubmit)}
		>
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
			<button
				className={cn("btn", errors.root && "btn-error")}
				type="submit"
				disabled={isSubmitting}
			>
				Sign Up
			</button>
			<Link href="/auth/sign-in" className="btn btn-xs">
				Sign in
			</Link>
			{errors.root && <span className="text-error">{errors.root.message}</span>}
		</form>
	);
};

export default SignUpForm;
