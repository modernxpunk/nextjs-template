import { relations } from "drizzle-orm";
import { integer, pgTable, serial, time, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const users = pgTable("User", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	// role: text("role", { enum: ["admin", "user"] }).notNull(),
});

const posts = pgTable("Post", {
	id: serial("id").primaryKey().notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: varchar("description", { length: 512 }).notNull(),
	createdAt: time("createdAt", { withTimezone: true }).defaultNow(),
	userId: integer("userId").notNull(),
});

// User -> Post
const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

const postsRelations = relations(posts, ({ one }) => ({
	user: one(users, { fields: [posts.userId], references: [users.id] }),
}));

const selectUserSchema = createSelectSchema(users);
const insertUserSchema = createInsertSchema(users);

const selectPostSchema = createSelectSchema(posts);
const insertPostSchema = createInsertSchema(posts);

export {
	// Tables
	users,
	posts,

	// Relations
	usersRelations,
	postsRelations,

	// Schema
	selectUserSchema,
	insertUserSchema,
	selectPostSchema,
	insertPostSchema,
};
