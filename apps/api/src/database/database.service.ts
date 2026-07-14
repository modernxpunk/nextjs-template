import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common";
import { type AppDatabase, closeDbConnection, db } from "@repo/db";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
	private readonly logger = new Logger(DatabaseService.name);
	readonly db: AppDatabase = db;

	constructor() {
		this.logger.log("Shared database connection pool initialized");
	}

	async onModuleDestroy() {
		await closeDbConnection();
		this.logger.log("Database connection pool closed");
	}
}
