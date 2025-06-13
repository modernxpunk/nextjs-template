"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";

const schemaResetPassword = z.object({
	newPassword: z
		.string()
		.min(6, { message: "Password must be at lea6t 8 characters long" }),
});

type ResetPasswordSchema = z.infer<typeof schemaResetPassword>;

const ResetPasswordForm = () => {
	const t = useTranslations();

	const methods = useForm<ResetPasswordSchema>({
		resolver: zodResolver(schemaResetPassword),
	});

	const { handleSubmit, control, setError } = methods;

	const onSubmit = async ({ newPassword }: ResetPasswordSchema) => {
		const token = new URLSearchParams(window.location.search).get("token");
		if (!token) {
			setError("root", {
				message: "Token is required",
			});
			return;
		}

		const resetPasswordResponse = await resetPassword({
			newPassword,
		});
		if (resetPasswordResponse.error) {
			setError("root", {
				message: resetPasswordResponse.error.message,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-sm px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">
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
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									{t("auth.resetPassword.subtitle")}
								</Button>
								<FormMessage className="text-red-500 text-sm" />
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPasswordForm;
