import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const UserTable = pgTable("User", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	// role: text("role", { enum: ["admin", "user"] }).notNull(),
});

export const selectUserSchema = createSelectSchema(UserTable);
export const insertUserSchema = createInsertSchema(UserTable);

export type UserId = Pick<typeof UserTable.$inferSelect, "id">;
export type User = Pick<typeof UserTable.$inferSelect, "email" | "name">;
export type NewUser = typeof UserTable.$inferInsert;
