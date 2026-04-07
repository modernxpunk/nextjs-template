import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { LoggerModule } from "nestjs-pino";
import { auth } from "./auth/auth";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { ItemsModule } from "./items/items.module";
import { pinoHttpConfig } from "./logger/pino.config";
import { StorageModule } from "./storage/storage.module";

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: pinoHttpConfig,
		}),
		AuthModule.forRoot({
			auth,
		}),
		DatabaseModule,
		HealthModule,
		ItemsModule,
		StorageModule,
	],
})
export class AppModule {}
