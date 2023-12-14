import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "@/env";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
			id: string;
			// ...other properties
			// role: UserRole;
		};
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

export const authOptions: NextAuthOptions = {
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub,
			},
		}),
	},
	pages: {
		signIn: "/sign-in",
	},
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
	],
};

export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
