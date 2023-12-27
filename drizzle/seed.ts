import { faker } from "@faker-js/faker";
import { users, posts } from "./schema";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config({ path: "./.env.local" });

const seed = async () => {
	const client = new Pool({
		connectionString: process.env.DATABASE_URL,
	});
	const db = drizzle(client);

	await db.delete(posts);
	await db.delete(users);

	const usersData: (typeof users.$inferInsert)[] = [];
	const postsData: (typeof posts.$inferInsert)[] = [];

	for (let i = 0; i < 20; i++) {
		const userId = +faker.string.numeric(5);
		usersData.push({
			id: userId,
			name: faker.internet.userName(),
			email: faker.internet.email(),
		});
		for (let j = 0; j < 10; j++) {
			const postId = +faker.string.numeric(6);
			postsData.push({
				id: postId,
				title: faker.lorem.paragraph(1),
				description: faker.lorem.paragraph(5),
				userId: userId,
			});
		}
	}

	await db.insert(users).values(usersData);
	await db.insert(posts).values(postsData);
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		console.log("Seeding done!");
		process.exit(0);
	});
