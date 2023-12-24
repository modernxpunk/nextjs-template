import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/server/routes/_app";

export default trpcNext.createNextApiHandler({
	router: appRouter,
	onError:
		process.env.NODE_ENV === "development"
			? ({ path, error }) => {
					console.error(
						`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
					);
			  }
			: undefined,
});
