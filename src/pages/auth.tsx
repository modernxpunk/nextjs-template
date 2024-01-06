import { NextPageWithLayout } from "@/types/common";
import Link from "next/link";
import Image from "next/image";
import { createContext, useState } from "react";
import SignIn from "@/components/forms/sign-in";
import SignUp from "@/components/forms/sign-up";
import ForgotPassword from "@/components/forms/forgot-password";

export const AuthContext = createContext<any>(null);

const Auth: NextPageWithLayout = () => {
	const [authForms, setAuthForms] = useState<
		"sign-up" | "sign-in" | "forgot-password"
	>("sign-in");

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
				<AuthContext.Provider value={{ setAuthForms }}>
					{authForms === "sign-in" && <SignIn />}
					{authForms === "sign-up" && <SignUp />}
					{authForms === "forgot-password" && <ForgotPassword />}
				</AuthContext.Provider>
			</div>
		</div>
	);
};

export default Auth;
