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

const schemaResetPassword = z.object({
	newPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type ResetPasswordSchema = z.infer<typeof schemaResetPassword>;

const ResetPasswordPage = () => {
	const t = useTranslations();

	const router = useRouter();

	const methods = useForm<ResetPasswordSchema>({
		resolver: zodResolver(schemaResetPassword),
		defaultValues: {
			newPassword: "",
		},
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

		const resetPasswordResponse = await resetPassword(
			{
				newPassword,
				token,
			},
			{
				onSuccess() {
					router.replace("/auth/sign-in");
				},
			},
		);

		if (resetPasswordResponse.error) {
			setError("root", {
				message: resetPasswordResponse.error.message,
			});
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
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button className="w-full" type="submit">
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

export default ResetPasswordPage;
