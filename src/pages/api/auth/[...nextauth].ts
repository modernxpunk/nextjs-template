import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
	],

	pages: {
		signIn: "/sign-in",
	},
};

export default NextAuth(authOptions);
