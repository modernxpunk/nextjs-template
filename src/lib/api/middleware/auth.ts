import { auth } from "@/lib/auth";
import { ORPCError, os } from "@orpc/server";
import type { User } from "@prisma/client";
import { headers } from "next/headers";

export const requiredAuthMiddleware = os
	.$context<{ session?: { user?: User } }>()
	.middleware(async ({ context, next }) => {
		const session =
			context.session ?? (await auth.api.getSession({ headers: headers() }));

		if (!session) {
			throw new ORPCError("UNAUTHORIZED");
		}

		return next({
			context: { user: session.user },
		});
	});
