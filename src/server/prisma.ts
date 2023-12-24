import { PrismaClient } from "@prisma/client";
import { PrismaClientOptions } from "@prisma/client/runtime/library";

const prismaGlobal = global as typeof global & {
	prisma?: PrismaClient;
};

const isDev = process.env.NODE_ENV === "development";

const prisma: PrismaClient<PrismaClientOptions, "query"> =
	prismaGlobal.prisma ||
	new PrismaClient({
		log: isDev ? ["query", "error", "warn"] : ["error"],
	});

if (isDev) {
	prisma.$on("query", (e) => {
		console.log("Query: " + e.query);
		console.log("Params: " + e.params);
		console.log("Duration: " + e.duration + "ms");
	});
}

if (process.env.NODE_ENV !== "production") {
	prismaGlobal.prisma = prisma;
}

export default prisma;
