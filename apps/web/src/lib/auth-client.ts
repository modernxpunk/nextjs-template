"use client";

import { adminClient } from "better-auth/client/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	userAc,
} from "better-auth/plugins/admin/access";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";

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

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_API_URL,
	plugins: [adminClient({ ac, roles })],
});

export type Session = typeof authClient.$Infer.Session;

export const { useSession, signIn, signUp, signOut, resetPassword } =
	authClient;
