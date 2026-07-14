import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { LoggerService } from "./common/logger";
import { webOrigins } from "./modules/auth/web-origins";
import { createOpenApiDocument } from "./openapi/openapi-document";

function parsePort(value: string | undefined): number {
	const port = Number(value ?? 4000);
	if (!Number.isInteger(port) || port < 1 || port > 65_535) {
		throw new Error(`Invalid API port: ${value ?? ""}`);
	}
	return port;
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
		bufferLogs: true,
	});

	const logger = await app.resolve(LoggerService);
	logger.setContext("Bootstrap");
	app.useLogger(logger);
	app.enableShutdownHooks();
	app.enableCors({
		credentials: true,
		origin: webOrigins,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			transform: true,
			whitelist: true,
		}),
	);

	const openApiDocument = await createOpenApiDocument(app);

	SwaggerModule.setup("docs", app, openApiDocument, {
		jsonDocumentUrl: "docs-json",
		yamlDocumentUrl: "docs-yaml",
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	const port = parsePort(process.env.PORT ?? process.env.API_PORT);
	await app.listen(port);
	logger.log(`API is running on http://localhost:${port}`);
}

void bootstrap().catch((error: unknown) => {
	const message = error instanceof Error ? error.stack : String(error);
	process.stderr.write(`Failed to start API: ${message}\n`);
	process.exitCode = 1;
});
