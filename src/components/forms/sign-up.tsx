"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/icon";
import { signUp } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "@/lib/i18n/config";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaSignUp = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpSchema>({
		resolver: zodResolver(schemaSignUp),
	});

	const router = useRouter();

	const onSubmit = async ({ email, password }: SignUpSchema) => {
		try {
			await signUp(email, password);
			router.push("/");
		} catch (err) {
			//
		} finally {
			//
		}
	};

	return (
		<form className="gap-4 form-control" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label className="label">
					<span className="label-text">Email</span>
					{errors.email && (
						<span className="label-text-alt text-error">
							{errors.email.message}
						</span>
					)}
				</label>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.email && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<Icon
						className={errors.email ? "text-error" : "text-inherit"}
						name="common/email"
					/>
					<input
						disabled={isSubmitting}
						type="text"
						className="grow"
						{...register("email")}
					/>
				</label>
			</div>
			<div>
				<label className="label">
					<span className="label-text">Password</span>
					{errors.password && (
						<span className="label-text-alt text-error">
							{errors.password.message}
						</span>
					)}
				</label>
				<label
					className={cn(
						"flex items-center gap-2 input input-bordered",
						errors.password && "input-error bg-error bg-opacity-10 text-error",
						isSubmitting && "input-disabled",
					)}
				>
					<Icon
						className={cn(errors.password ? "text-error" : "text-inherit")}
						name="common/lock"
					/>
					<input
						disabled={isSubmitting}
						type="password"
						className="grow"
						{...register("password")}
					/>
				</label>
				<label className="justify-end label">
					<Link href="/auth/forgot-password" className="label-text-alt">
						Forgot password?
					</Link>
				</label>
			</div>
			<button
				disabled={isSubmitting}
				className={cn("btn btn-primary", errors.root && "btn-error")}
			>
				sign up
			</button>
		</form>
	);
};

export default SignUpForm;
