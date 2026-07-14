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
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";

const schemaSignUp = z.object({
	name: z.string().trim().min(1, { message: "Name is required" }).max(100),
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpPage = () => {
	const t = useTranslations();
	const router = useRouter();
	const methods = useForm<SignUpSchema>({
		resolver: zodResolver(schemaSignUp),
		defaultValues: { name: "", email: "", password: "" },
	});
	const {
		control,
		formState: { errors, isSubmitting },
		handleSubmit,
		setError,
	} = methods;

	const onSubmit = async ({ name, email, password }: SignUpSchema) => {
		try {
			const response = await signUp.email({
				name: name.trim(),
				email,
				password,
				callbackURL: "/",
			});
			if (response.error) {
				setError("root", {
					message: response.error.message || t("auth.signUp.error"),
				});
				return;
			}
			router.push("/");
			router.refresh();
		} catch {
			setError("root", { message: t("auth.signUp.error") });
		}
	};

	return (
		<div className="flex w-full max-w-sm flex-col gap-6 px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">
						{t("auth.signUp.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex flex-col gap-6">
								<FormField
									control={control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("common.name")}</FormLabel>
											<FormControl>
												<Input {...field} autoComplete="name" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
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
											<FormLabel>{t("common.password")}</FormLabel>
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
									{t("common.signUp")}
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								{t("common.alreadyHaveAccount")}{" "}
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

export default SignUpPage;
