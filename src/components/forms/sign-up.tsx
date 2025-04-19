"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const schemaSignUp = z.object({
	email: z.string(), // .min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z.string(), // .min(6, { message: 'Password must be at least 6 characters long' }),
});

type SignUpSchema = z.infer<typeof schemaSignUp>;

const SignUpForm = () => {
	const methods = useForm<SignUpSchema>({
		resolver: zodResolver(schemaSignUp),
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = methods;

	const router = useRouter();

	const onSubmit = async ({ email, password }: SignUpSchema) => {
		const signUpResponse = await signUp.email({
			email: email,
			password: password,
			name: "",
			callbackURL: "/",
			fetchOptions: {
				onSuccess: () => {
					router.push("/");
				},
			},
		});
		console.log("signUpResponse", signUpResponse);
		if (signUpResponse.error) {
			setError("root", {
				message: signUpResponse.error.message,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-sm px-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl text-center">Sign up</CardTitle>
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
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full">
									Sign up
								</Button>
								<Button variant="outline" className="w-full">
									Sign up with Google
								</Button>
							</div>
							<div className="mt-4 text-sm text-center">
								Already have an account?{" "}
								<Link
									href="/auth/sign-in"
									className="underline underline-offset-4"
								>
									Login
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignUpForm;
