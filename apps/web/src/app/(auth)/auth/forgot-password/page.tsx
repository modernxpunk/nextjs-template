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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth-client";

const schemaForgotPassword = z.object({
	email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordSchema = z.infer<typeof schemaForgotPassword>;

export default function ForgotPasswordPage() {
	const t = useTranslations();
	const [requestSent, setRequestSent] = useState(false);
	const methods = useForm<ForgotPasswordSchema>({
		resolver: zodResolver(schemaForgotPassword),
		defaultValues: { email: "" },
	});
	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		setError,
	} = methods;

	const onSubmit = async ({ email }: ForgotPasswordSchema) => {
		try {
			const response = await requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});
			if (response.error) {
				setError("root", { message: t("auth.forgotPassword.error") });
				return;
			}
			setRequestSent(true);
		} catch {
			setError("root", { message: t("auth.forgotPassword.error") });
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
					{requestSent ? (
						<div className="space-y-4" aria-live="polite">
							<p className="text-muted-foreground text-sm">
								{t("auth.forgotPassword.success")}
							</p>
							<Button asChild className="w-full" variant="outline">
								<Link href="/auth/sign-in">{t("common.login")}</Link>
							</Button>
						</div>
					) : (
						<Form {...methods}>
							<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
								<FormField
									control={control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("common.email")}</FormLabel>
											<FormControl>
												<Input
													{...field}
													autoComplete="email"
													spellCheck={false}
													type="email"
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
									{t("common.sendEmail")}
								</Button>
							</form>
						</Form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
