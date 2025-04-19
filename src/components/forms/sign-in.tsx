"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
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

const schemaSignIn = z.object({
	email: z
		.string()
		.min(1, { message: "Email is required" })
		.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at lea6t 8 characters long" }),
});

type SignInSchema = z.infer<typeof schemaSignIn>;

const SignInForm = () => {
	const methods = useForm<SignInSchema>({
		resolver: zodResolver(schemaSignIn),
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
		setError,
	} = methods;

	const onSubmit = async ({ email, password }: SignInSchema) => {
		const signInResponse = await signIn.email({
			email: email,
			password: password,
			rememberMe: true,
			callbackURL: "/",
		});
		if (signInResponse.error) {
			setError("root", {
				message: signInResponse.error.message,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-sm px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">Login</CardTitle>
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder="m@gmail.com" {...field} />
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
												<span>Password</span>
												<Link
													href="/auth/forgot-password"
													className="hover:underline hover:underline-offset-4"
												>
													Forgot password?
												</Link>
											</FormLabel>
											<FormControl>
												<Input type="password" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full">
									Login
								</Button>
								<FormMessage className="text-red-500 text-sm" />

								<Button variant="outline" className="w-full">
									Login with Google
								</Button>
							</div>
							<div className="mt-4 text-sm text-center">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/sign-up"
									className="underline underline-offset-4"
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignInForm;
