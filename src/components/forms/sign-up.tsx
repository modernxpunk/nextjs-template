import { SignUpSchema, resolver, signUpSchema } from "@/utils/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Provider } from "@supabase/supabase-js";
import clsx from "clsx";
import { useContext } from "react";
import { AuthContext } from "@/pages/auth";
import Icon from "@/components/ui/icon";

const SignUp = () => {
	const { setAuthForms } = useContext(AuthContext);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpSchema>({
		resolver: resolver(signUpSchema),
	});

	const onSubmit: SubmitHandler<SignUpSchema> = async (formData) => {
		const { data, error } = await supabase.auth.signUp({
			email: formData.email,
			password: formData.password,
			options: {
				data: { username: formData.username },
				emailRedirectTo: window.location.origin,
			},
		});
		console.log("data", data);
		console.log("error", error);
		if (error) {
			setError("root", { message: error.message });
		} else {
			router.push("/");
		}
	};

	const onSubmitWithSocial = async (provider: Provider) => {
		await supabase.auth.signInWithOAuth({ provider });
	};

	return (
		<div className="w-full max-w-sm p-6 border rounded-lg shadow-lg bg-base-100 border-base-300">
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
						{errors.email && (
							<span className="text-red-500 label-text animate-appear">
								{errors.email?.message || ""}
							</span>
						)}
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
						{errors.username && (
							<span className="text-red-500 label-text animate-appear">
								{errors.username?.message || ""}
							</span>
						)}
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
						{errors.password && (
							<span className="text-red-500 label-text animate-appear">
								{errors.password?.message || ""}
							</span>
						)}
					</div>
					<div className="w-full join">
						<button type="button" className="btn join-item">
							<Icon name="common/lock" />
						</button>
						<input
							type="password"
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
						{errors.confirmPassword && (
							<span className="text-red-500 label-text animate-appear">
								{errors.confirmPassword?.message || ""}
							</span>
						)}
					</div>
					<div className="w-full join">
						<button type="button" className="btn join-item">
							<Icon name="common/lock" />
						</button>
						<input
							type="password"
							className={clsx(
								"input w-full join-item input-bordered",
								errors.confirmPassword && "input-error",
							)}
							{...register("confirmPassword")}
						/>
					</div>
				</label>

				<div className="mt-2">
					<button className="w-full btn btn-primary">SIGN UP</button>
					{errors.root && (
						<p className="text-right label-text text-error animate-appear">
							{errors.root.message}
						</p>
					)}
					<div className="label">
						<span className="label-text">
							You already have the accound?{" "}
							<span className="link" onClick={() => setAuthForms("sign-in")}>
								Sign in
							</span>
						</span>
					</div>
				</div>
			</form>
			<div className="divider">OR</div>
			<div className="flex flex-col gap-2">
				<button
					className="btn btn-outline btn-primary"
					onClick={() => onSubmitWithSocial("google")}
				>
					<Icon name="social/google" />
					Google
				</button>
				<button
					className="btn btn-outline btn-primary"
					onClick={() => onSubmitWithSocial("facebook")}
				>
					<Icon name="social/facebook" />
					Facebook
				</button>
				<button
					className="btn btn-outline btn-primary"
					onClick={() => onSubmitWithSocial("twitter")}
				>
					<Icon name="social/twitter" />
					Twitter
				</button>
				<button
					className="btn btn-outline btn-primary"
					onClick={() => onSubmitWithSocial("discord")}
				>
					<Icon name="social/discord" />
					Discord
				</button>
			</div>
		</div>
	);
};

export default SignUp;
