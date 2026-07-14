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
import { signIn } from "@/lib/auth-client";

const schemaSignIn = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type SignInSchema = z.infer<typeof schemaSignIn>;

const SignInPage = () => {
	const t = useTranslations();
	const [isGooglePending, setIsGooglePending] = useState(false);
	const methods = useForm<SignInSchema>({
		resolver: zodResolver(schemaSignIn),
		defaultValues: { email: "", password: "" },
	});

	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		setError,
	} = methods;

	const onSubmit = async ({ email, password }: SignInSchema) => {
		try {
			const response = await signIn.email({
				email,
				password,
				rememberMe: true,
				callbackURL: "/",
			});
			if (response.error) {
				setError("root", {
					message: response.error.message || t("auth.signIn.error"),
				});
			}
		} catch {
			setError("root", { message: t("auth.signIn.error") });
		}
	};

	const signInGoogle = async () => {
		setIsGooglePending(true);
		try {
			const response = await signIn.social({
				provider: "google",
				callbackURL: "/",
			});
			if (response.error) {
				setError("root", {
					message: response.error.message || t("auth.signIn.error"),
				});
			}
		} catch {
			setError("root", { message: t("auth.signIn.error") });
		} finally {
			setIsGooglePending(false);
		}
	};

	const isPending = isSubmitting || isGooglePending;

	return (
		<div className="flex w-full max-w-sm flex-col gap-6 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						{t("common.login")}
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

								<FormField
									control={control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex justify-between">
												<span>{t("common.password")}</span>
												<Link
													className="hover:underline hover:underline-offset-4"
													href="/auth/forgot-password"
												>
													{t("common.forgotPassword")}
												</Link>
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													autoComplete="current-password"
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

								<Button className="w-full" disabled={isPending} type="submit">
									{t("common.login")}
								</Button>
								<Button
									className="w-full"
									disabled={isPending}
									onClick={signInGoogle}
									type="button"
									variant="outline"
								>
									{t("common.loginWithGoogle")}
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								{t("common.dontHaveAccount")}{" "}
								<Link
									className="underline underline-offset-4"
									href="/auth/sign-up"
								>
									{t("common.signUp")}
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignInPage;
