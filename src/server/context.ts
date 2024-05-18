import { type inferAsyncReturnType } from "@trpc/server";
import { db } from "@/server/.drizzle/connection";

export const createContext = async () => {
	return {
		db,
	};
};

export type Context = inferAsyncReturnType<typeof createContext>;
