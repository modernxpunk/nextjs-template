import { authSchema, db } from "@repo/db";
import { sendForgotPasswordEmail } from "@repo/email";
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
import { webOrigins } from "./web-origins";

const apiUrl = process.env.API_URL?.trim();
if (!apiUrl) {
	throw new Error("API_URL environment variable is not set");
}
const parsedApiUrl = new URL(apiUrl);
if (parsedApiUrl.origin !== apiUrl.replace(/\/+$/, "")) {
	throw new Error("API_URL must be an exact origin without a path");
}

const betterAuthSecret = process.env.BETTER_AUTH_SECRET?.trim();
if (
	process.env.NODE_ENV === "production" &&
	(!betterAuthSecret || betterAuthSecret.length < 32)
) {
	throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters");
}

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || undefined;
const googleClientSecret =
	process.env.GOOGLE_CLIENT_SECRET?.trim() || undefined;
if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
	throw new Error(
		"GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together",
	);
}

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
	baseURL: apiUrl,
	secret: betterAuthSecret,
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
