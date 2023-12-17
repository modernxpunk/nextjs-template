import { NextPageWithLayout } from "@/types/common";
import { SignUpSchema, resolver, signUpSchema } from "@/utils/schemas";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import Icon from "@/components/ui/icon";
import Link from "next/link";

const SignUp: NextPageWithLayout = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpSchema>({
		resolver: resolver(signUpSchema),
	});

	const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
		await signIn("credentials", {
			email: data.email,
			username: data.username,
			password: data.password,
			confirmPassword: data.confirmPassword,
			signUp: true,
			callbackUrl: "/",
		});
	};

	return (
		<div className="flex items-center justify-center flex-1">
			<div className="w-full max-w-sm p-6 border rounded-lg shadow-lg border-base-300">
				<h2 className="text-3xl font-bold text-center">Sign up</h2>
				<p className="mt-2 text-sm text-center text-gray-500">
					Pls enter ur profile detail under boxes
				</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full gap-2 mt-4 form-control"
				>
					<label className="w-full form-control">
						<div className="label">
							<span className="label-text">Email</span>
							<span
								className={clsx(
									"text-red-500 label-text h-4",
									!errors.email && "invisible",
								)}
							>
								{errors.email?.message || ""}
							</span>
						</div>
						<div className="w-full join">
							<button type="button" className="btn join-item">
								<Icon name="common/email" />
							</button>
							<input
								className={clsx(
									"input w-full join-item input-bordered",
									errors.email && "input-error",
								)}
								{...register("email")}
							/>
						</div>
					</label>

					<label className="w-full form-control">
						<div className="label">
							<span className="label-text">Username</span>
							<span
								className={clsx(
									"text-red-500 label-text h-4",
									!errors.username && "invisible",
								)}
							>
								{errors.username?.message || ""}
							</span>
						</div>
						<div className="w-full join">
							<button type="button" className="btn join-item">
								<Icon name="common/account" />
							</button>
							<input
								className={clsx(
									"input w-full join-item input-bordered",
									errors.username && "input-error",
								)}
								{...register("username")}
							/>
						</div>
					</label>

					<label className="w-full form-control">
						<div className="label">
							<span className="label-text">Password</span>
							<span
								className={clsx(
									"text-red-500 label-text h-4",
									!errors.password && "invisible",
								)}
							>
								{errors.password?.message || ""}
							</span>
						</div>
						<div className="w-full join">
							<button type="button" className="btn join-item">
								<Icon name="common/lock" />
							</button>
							<input
								className={clsx(
									"input w-full join-item input-bordered",
									errors.password && "input-error",
								)}
								{...register("password")}
							/>
						</div>
					</label>

					<label className="w-full form-control">
						<div className="label">
							<span className="label-text">Confirm password</span>
							<span
								className={clsx(
									"text-red-500 label-text h-4",
									!errors.confirmPassword && "invisible",
								)}
							>
								{errors.confirmPassword?.message || ""}
							</span>
						</div>
						<div className="w-full join">
							<button type="button" className="btn join-item">
								<Icon name="common/lock" />
							</button>
							<input
								className={clsx(
									"input w-full join-item input-bordered",
									errors.confirmPassword && "input-error",
								)}
								{...register("confirmPassword")}
							/>
						</div>
					</label>

					<button
						className="w-full mt-2 btn btn-primary"
						// onClick={() => signIn("discord", { callbackUrl: "/" })}
					>
						SIGN UP
					</button>
					<div className="label">
						<span className="label-text">
							You have an account?{" "}
							<Link href="/sign-in" className="link">
								Sign in
							</Link>
						</span>
					</div>
				</form>
				<div className="divider">OR</div>
				<div className="flex flex-col gap-2">
					<button
						className="btn btn-outline btn-primary"
						onClick={() => signIn("google", { callbackUrl: "/" })}
					>
						<Icon name="social/google" />
						Google
					</button>
					<button
						className="btn btn-outline btn-primary"
						onClick={() => signIn("facebook", { callbackUrl: "/" })}
					>
						<Icon name="social/facebook" />
						Facebook
					</button>
					<button
						className="btn btn-outline btn-primary"
						onClick={() => signIn("twitch", { callbackUrl: "/" })}
					>
						<Icon name="social/twitter" />
						Twitter
					</button>
					<button
						className="btn btn-outline btn-primary"
						onClick={() => signIn("discord", { callbackUrl: "/" })}
					>
						<Icon name="social/discord" />
						Discord
					</button>
				</div>
			</div>
		</div>
	);
};

SignUp.getLayout = (page) => {
	return (
		<div className="flex items-center min-h-screen">
			<div className="self-stretch flex-1 bg-primary"></div>
			<div className="flex-1">{page}</div>
		</div>
	);
};

export default SignUp;
