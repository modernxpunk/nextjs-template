import { initTRPC } from "@trpc/server";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
	// throw new TRPCError({ code: "UNAUTHORIZED" });
	return next();
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
