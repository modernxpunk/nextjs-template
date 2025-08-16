import { prisma } from "@/lib/db";
import { os } from "@orpc/server";
import type { PrismaClient } from "@prisma/client";

export const dbProviderMiddleware = os
	.$context<{ db?: PrismaClient }>()
	.middleware(async ({ context, next }) => {
		const db = context.db ?? prisma;
		return next({
			context: {
				db,
			},
		});
	});
