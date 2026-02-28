import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/schema.ts",
	out: "./drizzle",
	schemaFilter: ["public"],
	tablesFilter: ["user", "session", "account", "verification", "item"],
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
