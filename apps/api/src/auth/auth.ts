import { authSchema, db } from "@repo/db";
import { sendForgotPasswordEmail } from "@repo/email/templates/reset-password";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const webOrigins = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
	baseURL: process.env.API_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
		camelCase: true,
	}),
	trustedOrigins: webOrigins,
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: false,
		sendResetPassword: async ({ user, url }) => {
			await sendForgotPasswordEmail({
				name: user.name,
				email: user.email,
				url,
			});
		},
	},
	...(googleClientId && googleClientSecret
		? {
				socialProviders: {
					google: {
						clientId: googleClientId,
						clientSecret: googleClientSecret,
					},
				},
			}
		: {}),
});

export type Session = typeof auth.$Infer.Session;
