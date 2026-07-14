"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "@/lib/auth-client";

const schemaResetPassword = z
	.object({
		newPassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters long" }),
		confirmPassword: z.string(),
	})
	.refine((values) => values.newPassword === values.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordSchema = z.infer<typeof schemaResetPassword>;

const ResetPasswordPage = () => {
	const t = useTranslations();
	const router = useRouter();
	const methods = useForm<ResetPasswordSchema>({
		resolver: zodResolver(schemaResetPassword),
		defaultValues: { newPassword: "", confirmPassword: "" },
	});
	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		setError,
	} = methods;

	const onSubmit = async ({ newPassword }: ResetPasswordSchema) => {
		const token = new URLSearchParams(window.location.search).get("token");
		if (!token) {
			setError("root", { message: t("auth.resetPassword.invalidLink") });
			return;
		}

		try {
			const response = await resetPassword({ newPassword, token });
			if (response.error) {
				setError("root", {
					message: response.error.message || t("auth.resetPassword.error"),
				});
				return;
			}
			router.replace("/auth/sign-in");
		} catch {
			setError("root", { message: t("auth.resetPassword.error") });
		}
	};

	return (
		<div className="flex w-full max-w-sm flex-col gap-6 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						{t("auth.resetPassword.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<FormField
									control={control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("common.newPassword")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													autoComplete="new-password"
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("common.confirmPassword")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													autoComplete="new-password"
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{errors.root?.message ? (
									<p className="text-destructive text-sm" role="alert">
										{errors.root.message}
									</p>
								) : null}
								<Button
									className="w-full"
									disabled={isSubmitting}
									type="submit"
								>
									{t("common.resetPassword")}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPasswordPage;
