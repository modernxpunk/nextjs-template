import { authSchema, db } from "@repo/db";
import { sendForgotPasswordEmail } from "@repo/email/templates/reset-password";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env/server";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
		camelCase: true,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }, _request) => {
			await sendForgotPasswordEmail({
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
