import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_API_URL: z.string().url().default("http://localhost:4000"),
	},
	runtimeEnv: process.env,
});
