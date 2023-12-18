import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "@/env";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/server/prisma";

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
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			const isAllowedToSignIn = true;
			if (isAllowedToSignIn) {
				return true;
			} else {
				return false;
			}
		},
		session: ({ session, user }) => {
			return {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
			};
		},
	},
	pages: {
		signIn: "/sign-in",
		newUser: "/sign-up",
	},
	providers: [
		// @ts-ignore
		{
			id: "sendgrid",
			type: "email",
			// @ts-ignore
			async sendVerificationRequest({ identifier: email, url }) {
				const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
					body: JSON.stringify({
						personalizations: [{ to: [{ email }] }],
						from: { email: "modernxpunk@gmail.com" },
						subject: "Sign in to Your page",
						content: [
							{
								type: "text/plain",
								value: `Please click here to authenticate - ${url}`,
							},
						],
					}),
					headers: {
						Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
						"Content-Type": "application/json",
					},
					method: "POST",
				});

				if (!response.ok) {
					const { errors } = await response.json();
					throw new Error(JSON.stringify(errors));
				}
			},
		},
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			allowDangerousEmailAccountLinking: true,
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
