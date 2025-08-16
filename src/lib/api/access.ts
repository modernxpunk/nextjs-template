import { os } from "@orpc/server";
import { dbProviderMiddleware } from "@/lib/api/middleware/db";
import { requiredAuthMiddleware } from "@/lib/api/middleware/auth";

export const pub = os.use(dbProviderMiddleware);

export const authed = pub.use(requiredAuthMiddleware);
