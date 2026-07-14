import { existsSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { DefaultLogger } from "drizzle-orm/logger";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Load .env from monorepo root (works from any cwd)
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

const globalForDb = globalThis as typeof globalThis & {
	__dbPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is required");
}

const pool =
	globalForDb.__dbPool ??
	new Pool({
		connectionString,
	});

if (process.env.NODE_ENV !== "production") {
	globalForDb.__dbPool = pool;
}

export type AppDatabase = NodePgDatabase<typeof schema>;

export const db: AppDatabase = drizzle(pool, {
	schema,
	logger:
		process.env.NODE_ENV === "production" || process.env.DB_LOGGING === "false"
			? undefined
			: new DefaultLogger(),
});

export async function closeDbConnection(): Promise<void> {
	await pool.end();
	if (globalForDb.__dbPool === pool) {
		delete globalForDb.__dbPool;
	}
}
