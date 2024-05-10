import { appRouter } from "@/server/routes/_app";
import { configTrpc } from "@/utils/trpc";

export const trpcServer = appRouter.createCaller(configTrpc);