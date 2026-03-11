"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_API_URL,
});

export type Session = typeof authClient.$Infer.Session;

export const { useSession, signIn, signUp, signOut, resetPassword } =
	authClient;
