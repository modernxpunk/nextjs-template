"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPassword } from "@/lib/auth-client";
import Link from "next/link";
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

const schemaForgotPassword = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email address" }),
});

type ForgotPasswordSchema = z.infer<typeof schemaForgotPassword>;

const ForgotPasswordForm = () => {
	const t = useTranslations();

	const methods = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(schemaForgotPassword),
	});

	const { handleSubmit, control, setError } = methods;

	const onSubmit = async ({ email }: ForgotPasswordSchema) => {
		const forgotPasswordResponse = await forgetPassword({
			email,
			redirectTo: "/auth/reset-password",
		});
		if (forgotPasswordResponse.error) {
			setError("root", {
				message: forgotPasswordResponse.error.message,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-sm px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						{t("auth.forgotPassword.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<FormField
									control={control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("common.email")}</FormLabel>
											<FormControl>
												<Input placeholder="m@gmail.com" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									{t("common.sendEmail")}
								</Button>
								<FormMessage className="text-red-500 text-sm" />
							</div>
							<div className="mt-4 text-sm text-center">
								{t("common.rememberPassword")}{" "}
								<Link
									href="/auth/sign-in"
									className="underline underline-offset-4"
								>
									{t("common.login")}
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPasswordForm;
