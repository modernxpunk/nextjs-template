import "reflect-metadata";
import { writeFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { LoggerService } from "./common/logger";
import { createOpenApiDocument } from "./openapi/openapi-document";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
		bufferLogs: true,
	});

	const logger = await app.resolve(LoggerService);
	logger.setContext("Bootstrap");
	app.useLogger(logger);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	const openApiDocument = await createOpenApiDocument(app);

	const filePath = resolvePath(process.cwd(), "openapi.json");
	await writeFile(filePath, JSON.stringify(openApiDocument, null, 2), "utf8");
	logger.log(`OpenAPI spec saved to ${filePath}`);

	SwaggerModule.setup("docs", app, openApiDocument, {
		jsonDocumentUrl: "docs-json",
		yamlDocumentUrl: "docs-yaml",
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
	await app.listen(port);
	logger.log(`API is running on http://localhost:${port}`);
}

void bootstrap();
