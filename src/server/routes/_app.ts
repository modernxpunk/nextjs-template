import { router } from "@/server/trpc";
import user from "@/server/routes/user";
import post from "@/server/routes/post";

export const appRouter = router({
	user,
	post,
});

export type AppRouter = typeof appRouter;
