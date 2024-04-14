"use client";

import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { resolver } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaSignIn = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

type SignInForm = z.infer<typeof schemaSignIn>;

const Page = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInForm>({
		resolver: resolver(schemaSignIn),
	});

	const router = useRouter();

	const onSubmit = ({ email, password }: SignInForm) => {
		try {
			// await signIn(email, password);
			router.push("/");
		} catch (err) {
			//
		} finally {
			//
		}
	};

	return (
		<div onSubmit={handleSubmit(onSubmit)}>
			<h1>Sign in</h1>
			<form className="gap-4 form-control">
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
							errors.password &&
								"input-error bg-error bg-opacity-10 text-error",
							isSubmitting && "input-disabled",
						)}
					>
						<Icon
							className={errors.password ? "text-error" : "text-inherit"}
							name="common/lock"
						/>
						<input
							disabled={isSubmitting}
							type="password"
							className="grow"
							{...register("password")}
						/>
					</label>
				</div>
				<button
					disabled={isSubmitting}
					className={cn("btn btn-primary", errors.root && "btn-error")}
				>
					sign in
				</button>
			</form>
		</div>
	);
};

export default Page;
