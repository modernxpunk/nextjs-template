import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";
import { SignInSchema, resolver, signInSchema } from "@/utils/schemas";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import Icon from "@/components/ui/icon";

const SignIn: NextPageWithLayout = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SignInSchema>({
		resolver: resolver(signInSchema),
	});

	const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
		reset();
	};

	return (
		<div className="flex items-center justify-center flex-1">
			<div className="w-full max-w-sm p-6 border rounded-lg shadow-lg border-base-300">
				<h2 className="text-3xl font-bold text-center">Sign in</h2>
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
						<div className="self-end label">
							<span className="label-text link">Forgot your password?</span>
						</div>
					</label>
					<button
						className="w-full btn btn-primary"
						// onClick={() => signIn("discord", { callbackUrl: "/" })}
					>
						SIGN IN
					</button>
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

SignIn.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default SignIn;
