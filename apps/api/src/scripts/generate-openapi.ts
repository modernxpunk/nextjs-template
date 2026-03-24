import "reflect-metadata";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { createOpenApiDocument } from "../openapi/openapi-document";

async function generateOpenApiSpec() {
	const app = await NestFactory.create(AppModule, {
		bodyParser: false,
		logger: false,
	});

	try {
		const document = await createOpenApiDocument(app);
		const filePath = resolve(process.cwd(), "openapi.json");

		await mkdir(dirname(filePath), { recursive: true });
		await writeFile(filePath, JSON.stringify(document, null, 2), "utf8");
		console.info(`OpenAPI schema saved to ${filePath}`);
	} finally {
		await app.close();
	}
}

void generateOpenApiSpec();
