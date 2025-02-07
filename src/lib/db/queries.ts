import { eq } from "drizzle-orm";
import { db, UsersTable } from "./schema";

export async function getAllUsers() {
	return await db.select().from(UsersTable);
}

export async function addUser(name: string, email: string, image: string) {
	return await db.insert(UsersTable).values({ name, email, image }).returning();
}

export async function updateUser(id: number, name: string) {
	return await db.update(UsersTable).set({ name }).where(eq(UsersTable.id, id));
}

export async function deleteUser(id: number) {
	return await db.delete(UsersTable).where(eq(UsersTable.id, id));
}
