import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { client, db } from "./connection";

const main = async () => {
	// @ts-ignore
	await migrate(db, { migrationsFolder: "src/server/.drizzle/migration" });
	await client.end();
};

main();
