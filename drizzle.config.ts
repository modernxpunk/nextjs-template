import type { Config } from "drizzle-kit";

export default {
	schema: "src/server/.drizzle/schema.ts",
	out: "src/server/.drizzle/migration",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
} satisfies Config;
