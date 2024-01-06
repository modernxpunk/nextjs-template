import {
	ForgotPasswordSchema,
	SignInSchema,
	forgotPasswordSchema,
	resolver,
	signInSchema,
} from "@/utils/schemas";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Provider } from "@supabase/supabase-js";
import clsx from "clsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/pages/auth";
import Icon from "@/components/ui/icon";

const ForgotPassword = () => {
	const { setAuthForms } = useContext(AuthContext);
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordSchema>({
		resolver: resolver(forgotPasswordSchema),
	});

	const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (formData) => {
		const { error } = await supabase.auth.resetPasswordForEmail(
			formData.email,
			{
				redirectTo: window.location.origin,
			},
		);
		if (error) {
			setError("root", { message: error.message });
		} else {
			router.push("/");
		}
	};

	// const accessToken = "";
	// const refreshToken = "";

	// useEffect(() => {
	// 	const getSessionWithTokens = async () => {
	// 		if (accessToken && refreshToken) {
	// 			const { data, error } = await supabase.auth.setSession({
	// 				access_token: accessToken,
	// 				refresh_token: refreshToken,
	// 			});

	// 			if (error) {
	// 				alert(`Error signing in: ${error.message}`);
	// 			}
	// 		}
	// 	};
	// 	if (accessToken && refreshToken) {
	// 		getSessionWithTokens();
	// 	}
	// }, [accessToken, refreshToken]);

	// const handleSubmitStage2 = async (formData) => {
	// 	const { data, error } = await supabase.auth.updateUser({
	// 		password: formData.newPassword,
	// 	});
	// };

	const onSubmitWithSocial = async (provider: Provider) => {
		await supabase.auth.signInWithOAuth({ provider });
	};

	return (
		<div className="w-full max-w-sm p-6 border rounded-lg shadow-lg bg-base-100 border-base-300">
			<h2 className="text-3xl font-bold text-center">Reset your password</h2>
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

				<div>
					<button className="w-full btn btn-primary">
						SEND RESET PASSWORD
					</button>
					{errors.root && (
						<p className="text-right label-text text-error animate-appear">
							{errors.root.message}
						</p>
					)}
					<div className="label">
						<span className="label-text">
							You remember your password?{" "}
							<span className="link" onClick={() => setAuthForms("sign-in")}>
								Sign up
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

export default ForgotPassword;
