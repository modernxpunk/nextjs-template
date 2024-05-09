import { publicProcedure, router } from "@/server/trpc";

export const appRouter = router({
	greetings: publicProcedure.query(async () => {
		return "Hello World!";
	}),
});

export type AppRouter = typeof appRouter;
