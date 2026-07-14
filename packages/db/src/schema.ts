import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const user = pgTable(
	"user",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull(),
		emailVerified: boolean("emailVerified").notNull(),
		image: text("image"),
		role: text("role").default("user"),
		banned: boolean("banned").default(false),
		banReason: text("banReason"),
		banExpires: timestamp("banExpires", { mode: "date" }),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
	},
	(table) => [uniqueIndex("user_email_key").on(table.email)],
);

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
		token: text("token").notNull(),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
		ipAddress: text("ipAddress"),
		userAgent: text("userAgent"),
		impersonatedBy: text("impersonatedBy"),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [
		uniqueIndex("session_token_key").on(table.token),
		index("session_user_id_idx").on(table.userId),
	],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("accountId").notNull(),
		providerId: text("providerId").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("accessToken"),
		refreshToken: text("refreshToken"),
		idToken: text("idToken"),
		accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
			mode: "date",
		}),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
	},
	(table) => [
		index("account_user_id_idx").on(table.userId),
		index("account_provider_account_idx").on(table.providerId, table.accountId),
	],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
		createdAt: timestamp("createdAt", { mode: "date" }),
		updatedAt: timestamp("updatedAt", { mode: "date" }),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const item = pgTable(
	"item",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("item_user_id_idx").on(table.userId)],
);

export const authSchema = {
	user,
	session,
	account,
	verification,
};

export type SelectItem = typeof item.$inferSelect;
export type InsertItem = typeof item.$inferInsert;

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
