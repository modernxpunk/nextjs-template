import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./auth/auth";
import { HealthController } from "./health/health.controller";
import { ItemsController } from "./items/items.controller";

@Module({
	imports: [
		AuthModule.forRoot({
			auth,
		}),
	],
	controllers: [HealthController, ItemsController],
})
export class AppModule {}
