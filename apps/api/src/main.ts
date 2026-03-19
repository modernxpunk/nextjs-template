import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
		bufferLogs: true,
	});
	app.useLogger(app.get(Logger));

	const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
	await app.listen(port);
	app.get(Logger).log(`API is running on http://localhost:${port}`);
}

void bootstrap();
