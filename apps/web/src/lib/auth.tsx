import { prisma } from "@repo/db";
import { sendResetPasswordEmail } from "@repo/email/templates/reset-password";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env/server";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }, _request) => {
			await sendResetPasswordEmail({
				name: user.name,
				email: user.email,
				url,
			});
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
