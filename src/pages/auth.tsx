import { NextPageWithLayout } from "@/types/common";
import { SignInSchema, resolver, signInSchema } from "@/utils/schemas";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import Icon from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { Provider } from "@supabase/supabase-js";

const Auth: NextPageWithLayout = () => {
	const router = useRouter();
	const supabase = createClientComponentClient();

	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInSchema>({
		resolver: resolver(signInSchema),
	});

	const onSubmit: SubmitHandler<SignInSchema> = async (formData) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: formData.email,
			password: formData.password,
		});
		if (error) {
			setError("root", { message: error.message });
		} else {
			router.push("/");
		}
	};

	const onSubmitWithSocial = async (provider: Provider) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
		});
		// await router.reload();
	};

	// const handleSignUp = async () => {
	// 	await supabase.auth.signUp({
	// 		email: "asd@gmail.com",
	// 		password: "123123",
	// 		options: {
	// 			emailRedirectTo: `${location.origin}/auth/callback`,
	// 			data: {
	// 				sdf: 123,
	// 			},
	// 		},
	// 	});
	// };

	return (
		<div className="w-full max-w-sm p-6 border rounded-lg shadow-lg bg-base-100 border-base-300">
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
					<div className="self-end label">
						<span className="label-text link">Forgot your password?</span>
					</div>
				</label>
				<div>
					<button className="w-full btn btn-primary">SIGN IN</button>
					{errors.root && (
						<p className="text-right label-text text-error animate-appear">
							{errors.root.message}
						</p>
					)}
					<div className="label">
						<span className="label-text">
							You don&apos;t have an account created?{" "}
							<Link href="/sign-up" className="link">
								Sign up
							</Link>
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

Auth.getLayout = (page) => {
	return (
		<div className="flex flex-col items-stretch min-h-screen xl:flex-row">
			<div className="relative flex flex-col p-4 flex-1 xl:flex-[2]">
				<div className="flex gap-2">
					<Link className="btn btn-primary btn-sm" href="/about-us">
						About us
					</Link>
					<Link className="btn btn-primary btn-sm" href="/feedback">
						Contact us
					</Link>
				</div>
				<div className="flex items-center justify-center flex-1">
					<div className="w-full max-w-lg">
						<h1 className="text-3xl font-bold">
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
						</h1>
						<h2 className="mt-4 text-xl">
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam
							modi doloribus, nobis adipisci illo tempore commodi obcaecati
							veniam nihil ipsam, ad voluptas explicabo magnam aut vel atque
							assumenda quidem cupiditate.
						</h2>
					</div>
				</div>
				<Image
					width={2000}
					height={2000}
					className="absolute inset-0 self-center justify-center object-cover w-full h-full opacity-10 -z-10"
					src="https://picsum.photos/2000/2000?grayscale&blur=1"
					alt="back"
				/>
			</div>
			<div className="flex items-center justify-center flex-1 p-4 bg-primary">
				{page}
			</div>
		</div>
	);
};

export default Auth;
