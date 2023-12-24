import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext({
	req,
	res,
}: trpcNext.CreateNextContextOptions) {
	const user = { id: "123", name: "asd", email: "asd@gmail.com" };
	return {
		user,
	};
}
export type Context = Awaited<ReturnType<typeof createContext>>;
