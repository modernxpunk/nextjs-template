import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";
import { signIn } from "next-auth/react";

const SignIn: NextPageWithLayout = () => {
	return (
		<div>
			<button
				className="btn"
				onClick={() => signIn("github", { callbackUrl: "/" })}
			>
				sign in
			</button>
		</div>
	);
};

SignIn.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default SignIn;
