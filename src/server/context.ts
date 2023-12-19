import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerAuthSession } from "@/server/auth";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
	const { req, res } = opts;
	const session = await getServerAuthSession({ req, res });
	console.log("session", session);
	return {
		session,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
