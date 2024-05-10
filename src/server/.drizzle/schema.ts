import { pgTable, serial, text } from "drizzle-orm/pg-core";

export var users = pgTable("posts", {
	id: serial("id").primaryKey(),
	title: text("title"),
});
