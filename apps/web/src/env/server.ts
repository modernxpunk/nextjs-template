import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		API_URL: z.string().url(),

		EMAIL_USER: z.string(),
		EMAIL_PASS: z.string(),

		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
	},

	runtimeEnv: process.env,
});
