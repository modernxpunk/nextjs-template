import "dotenv/config";
import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const UsersTable = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		image: text("image").notNull(),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
	},
	(users) => {
		return {
			uniqueIdx: uniqueIndex("unique_idx").on(users.email),
		};
	},
);

export type User = InferSelectModel<typeof UsersTable>;
export type NewUser = InferInsertModel<typeof UsersTable>;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { casing: "snake_case" });
