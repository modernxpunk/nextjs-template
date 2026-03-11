import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
	});

	const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
	await app.listen(port);
	console.log(`API is running on http://localhost:${port}`);
}

void bootstrap();
