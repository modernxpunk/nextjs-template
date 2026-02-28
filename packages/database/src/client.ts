import { drizzle } from "drizzle-orm/node-postgres";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import { Pool } from "pg";
import * as schema from "./schema";

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

export const db = drizzle(pool, { schema, logger: new EnhancedQueryLogger() });
