import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { OpenApiMeta } from "trpc-openapi";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
	// throw new TRPCError({ code: "UNAUTHORIZED" });
	return next();
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
