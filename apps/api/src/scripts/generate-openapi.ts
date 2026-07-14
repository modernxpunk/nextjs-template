import "reflect-metadata";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { NestFactory } from "@nestjs/core";

const setBuildEnvironmentDefaults = () => {
	process.env.DATABASE_URL ??=
		"postgresql://openapi:openapi@localhost:5432/openapi";
	process.env.API_URL ??= "http://localhost:4000";
	process.env.WEB_ORIGIN ??= "http://localhost:3000";
	process.env.BETTER_AUTH_SECRET ??=
		"openapi-build-only-secret-with-32-characters";
	process.env.S3_ENDPOINT ??= "http://localhost:9000";
	process.env.S3_ACCESS_KEY ??= "openapi";
	process.env.S3_SECRET_KEY ??= "openapi-build-only";
};

async function generateOpenApiSpec() {
	setBuildEnvironmentDefaults();
	const [{ AppModule }, { createOpenApiDocument }] = await Promise.all([
		import("../app.module.js"),
		import("../openapi/openapi-document.js"),
	]);
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

void generateOpenApiSpec().catch((error: unknown) => {
	const message = error instanceof Error ? error.stack : String(error);
	process.stderr.write(`Failed to generate OpenAPI schema: ${message}\n`);
	process.exitCode = 1;
});
