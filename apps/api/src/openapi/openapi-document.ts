import type { INestApplication } from "@nestjs/common";
import {
	DocumentBuilder,
	type OpenAPIObject,
	SwaggerModule,
} from "@nestjs/swagger";
import { auth } from "../auth/auth";

type OpenApiComponents = NonNullable<OpenAPIObject["components"]>;
const AUTH_PREFIX = "/api/auth";

const mergeArrayByName = <T extends { name?: string }>(
	left: T[] = [],
	right: T[] = [],
): T[] => {
	const merged = new Map<string, T>();

	for (const item of [...left, ...right]) {
		const key = item.name ?? JSON.stringify(item);
		merged.set(key, item);
	}

	return [...merged.values()];
};

const mergeOpenApiDocuments = (
	base: OpenAPIObject,
	extension: Partial<OpenAPIObject>,
): OpenAPIObject => {
	const baseComponents: OpenApiComponents = base.components ?? {};
	const extensionComponents: OpenApiComponents = extension.components ?? {};

	return {
		...base,
		...extension,
		info: base.info,
		servers: base.servers,
		paths: {
			...base.paths,
			...(extension.paths ?? {}),
		},
		tags: mergeArrayByName(base.tags ?? [], extension.tags ?? []),
		components: {
			...baseComponents,
			...extensionComponents,
			schemas: {
				...(baseComponents.schemas ?? {}),
				...(extensionComponents.schemas ?? {}),
			},
			responses: {
				...(baseComponents.responses ?? {}),
				...(extensionComponents.responses ?? {}),
			},
			parameters: {
				...(baseComponents.parameters ?? {}),
				...(extensionComponents.parameters ?? {}),
			},
			requestBodies: {
				...(baseComponents.requestBodies ?? {}),
				...(extensionComponents.requestBodies ?? {}),
			},
			headers: {
				...(baseComponents.headers ?? {}),
				...(extensionComponents.headers ?? {}),
			},
			securitySchemes: {
				...(baseComponents.securitySchemes ?? {}),
				...(extensionComponents.securitySchemes ?? {}),
			},
			links: {
				...(baseComponents.links ?? {}),
				...(extensionComponents.links ?? {}),
			},
			callbacks: {
				...(baseComponents.callbacks ?? {}),
				...(extensionComponents.callbacks ?? {}),
			},
			examples: {
				...(baseComponents.examples ?? {}),
				...(extensionComponents.examples ?? {}),
			},
		} as OpenApiComponents,
	};
};

const addPathPrefix = (
	paths: OpenAPIObject["paths"] | undefined,
	prefix: string,
): OpenAPIObject["paths"] => {
	if (!paths) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(paths).map(([path, value]) => {
			const normalizedPath = path.startsWith(prefix)
				? path
				: `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
			return [normalizedPath, value];
		}),
	);
};

export const createOpenApiDocument = async (
	app: INestApplication,
): Promise<OpenAPIObject> => {
	const nestDocument = SwaggerModule.createDocument(
		app,
		new DocumentBuilder()
			.setTitle("NextJS Template API")
			.setDescription(
				"Unified OpenAPI document for NestJS controllers and Better Auth endpoints.",
			)
			.addServer(process.env.API_URL ?? "http://localhost:4000")
			.setVersion("1.0.0")
			.build(),
	);

	const betterAuthDocument = await auth.api.generateOpenAPISchema();
	return mergeOpenApiDocuments(nestDocument, {
		...(betterAuthDocument as Partial<OpenAPIObject>),
		paths: addPathPrefix(
			(betterAuthDocument as Partial<OpenAPIObject>).paths,
			AUTH_PREFIX,
		),
		servers: undefined,
	});
};
