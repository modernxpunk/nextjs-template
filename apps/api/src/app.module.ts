import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { LoggerModule } from "./common/logger";
import { DatabaseModule } from "./database/database.module";
import { auth } from "./modules/auth/auth";
import { HealthModule } from "./modules/health/health.module";
import { ItemsModule } from "./modules/items/items.module";
import { StorageModule } from "./modules/storage/storage.module";

@Module({
	imports: [
		LoggerModule,
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
