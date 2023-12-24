import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "@/server/routes/_app";

export const openApiDocument = generateOpenApiDocument(appRouter, {
	title: "tRPC OpenAPI",
	description: "OpenAPI compliant REST API built using tRPC with Next.js",
	version: "1.0.0",
	baseUrl: "http://localhost:3000/api",
});
