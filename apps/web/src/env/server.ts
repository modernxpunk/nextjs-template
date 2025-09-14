import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// only allow "true" or "false"
		ONLY_BOOLEAN: z
			.string()
			.refine((s) => s === "true" || s === "false")
			.transform((s) => s === "true"),

		// only allow number
		ONLY_NUMBER: z
			.string()
			.transform((s) => Number.parseInt(s, 10))
			.pipe(z.number()),

		NODE_ENV: z.enum(["development", "production"]),
		PORT: z.string().optional(),
		PWD: z.string().optional(),

		REQUIRED_VAR: z.string(),
		OPTIONAL_VAR: z.string().optional(),
		DATABASE_URL: z.string().url(),

		EMAIL_USER: z.string(),
		EMAIL_PASS: z.string(),

		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
	},

	runtimeEnv: process.env,
});
