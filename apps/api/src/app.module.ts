import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { LoggerModule } from "nestjs-pino";
import { auth } from "./auth/auth";
import { HealthController } from "./health/health.controller";
import { ItemsController } from "./items/items.controller";
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
		StorageModule,
	],
	controllers: [HealthController, ItemsController],
})
export class AppModule {}
