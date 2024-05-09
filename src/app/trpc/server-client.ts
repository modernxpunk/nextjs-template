import { appRouter } from "@/server";
import { configTrpc } from "@/utils/trpc";

export const trpcServer = appRouter.createCaller(configTrpc);
