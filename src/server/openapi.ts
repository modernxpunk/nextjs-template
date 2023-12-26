import { generateOpenApiDocument } from "trpc-openapi";
import { appRouter } from "@/server/routes/_app";

export const openApiDocument = generateOpenApiDocument(appRouter, {
	title: "trpc example title",
	description: "trpc example description",
	version: "1.0.0",
	baseUrl: "http://localhost:3000/api",
});
