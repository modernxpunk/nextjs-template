import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const isAuthed = t.middleware(({ ctx, next }) => {
	// throw new TRPCError({ code: "UNAUTHORIZED" });
	return next();
});

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
