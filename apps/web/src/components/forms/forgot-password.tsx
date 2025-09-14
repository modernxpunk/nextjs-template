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
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgetPassword } from "@/lib/auth-client";

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
		<div className="flex w-full max-w-sm flex-col gap-6 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
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
								<Button className="w-full" type="submit">
									{t("common.sendEmail")}
								</Button>
								<FormMessage className="text-red-500 text-sm" />
							</div>
							<div className="mt-4 text-center text-sm">
								{t("common.rememberPassword")}{" "}
								<Link
									className="underline underline-offset-4"
									href="/auth/sign-in"
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
