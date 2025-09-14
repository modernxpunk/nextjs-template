import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	client: {
		PUBLIC_HELLO: z.string(),
	},
	runtimeEnv: process.env,
});
