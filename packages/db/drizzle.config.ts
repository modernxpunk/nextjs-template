import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const apiEnvironmentPath = resolve(process.cwd(), "../../apps/api/.env");
if (!process.env.DATABASE_URL && existsSync(apiEnvironmentPath)) {
	dotenv.config({ path: apiEnvironmentPath, quiet: true });
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL is required. Set it in the environment or apps/api/.env.",
	);
}

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema.ts",
	out: "./drizzle",
	schemaFilter: ["public"],
	dbCredentials: {
		url: databaseUrl,
	},
});
