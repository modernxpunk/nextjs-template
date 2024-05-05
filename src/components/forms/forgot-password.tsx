"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Icon from "@/components/icon";
import { forgotPassword } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "@/lib/i18n/config";

const schemaForgotPassword = z.object({
	email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof schemaForgotPassword>;

const ForgotPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(schemaForgotPassword),
	});

	const router = useRouter();

	const onSubmit = async ({ email }: ForgotPasswordSchema) => {
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
			<button
				disabled={isSubmitting}
				className={cn("btn btn-primary", errors.root && "btn-error")}
			>
				submit
			</button>
		</form>
	);
};

export default ForgotPasswordForm;
