import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import * as schema from "@repo/db";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export type AppDatabase = NodePgDatabase<typeof schema>;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	private readonly pool: Pool;
	private readonly logger = new Logger(DatabaseService.name);
	readonly db: AppDatabase;

	constructor() {
		const connectionString = process.env.DATABASE_URL;

		if (!connectionString) {
			throw new Error("DATABASE_URL environment variable is not set");
		}

		this.pool = new Pool({ connectionString });
		this.db = drizzle(this.pool, { schema });

		this.logger.log("Database connection pool initialized");
	}

	async onModuleDestroy() {
		await this.pool.end();
		this.logger.log("Database connection pool closed");
	}
}
