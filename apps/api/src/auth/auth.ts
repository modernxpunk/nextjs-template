import { authSchema, db } from "@repo/db";
import { sendForgotPasswordEmail } from "@repo/email/templates/reset-password";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { admin } from "better-auth/plugins/admin";
import {
	adminAc,
	defaultStatements,
	userAc,
} from "better-auth/plugins/admin/access";

const webOrigins = (process.env.WEB_ORIGIN ?? "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const adminUserIds = (process.env.ADMIN_USER_IDS ?? "")
	.split(",")
	.map((value) => value.trim())
	.filter(Boolean);

const statement = {
	...defaultStatements,
	project: ["read", "create", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const roles = {
	admin: ac.newRole({
		...adminAc.statements,
		project: ["read", "create", "update", "delete"],
	}),
	user: ac.newRole({
		...userAc.statements,
		project: ["read"],
	}),
	support: ac.newRole({
		project: ["read"],
	}),
};

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
	plugins: [
		admin({
			ac,
			roles,
			adminUserIds,
			defaultRole: "user",
			adminRoles: ["admin"],
			impersonationSessionDuration: 60 * 60 * 24, // 1 day
			defaultBanReason: "Violation of terms of service",
			bannedUserMessage:
				"Your account is currently suspended. Contact support if this seems incorrect.",
		}),
		openAPI({
			disableDefaultReference: true,
		}),
	],
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
