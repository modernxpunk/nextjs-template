"use client";

import Icon from "@/components/icon";
import { forgotPassword } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { resolver } from "@/utils/config";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaForgotPassword = z.object({
	email: z.string().email(),
});

type ForgotPasswordForm = z.infer<typeof schemaForgotPassword>;

const Page = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordForm>({
		resolver: resolver(schemaForgotPassword),
	});

	const router = useRouter();

	const onSubmit = async ({ email }: ForgotPasswordForm) => {
		try {
			await forgotPassword(email);
			router.push("/");
		} catch (err) {
			//
		} finally {
			//
		}
	};

	return (
		<div onSubmit={handleSubmit(onSubmit)}>
			<h1>Forgot password</h1>
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
				<button
					disabled={isSubmitting}
					className={cn("btn btn-primary", errors.root && "btn-error")}
				>
					submit
				</button>
			</form>
		</div>
	);
};

export default Page;
