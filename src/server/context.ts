import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import * as trpcNext from "@trpc/server/adapters/next";

interface CreateInnerContextOptions
	extends Partial<trpcNext.CreateNextContextOptions> {
	supabase: SupabaseClient | null;
}

export async function createContextInner(opts?: CreateInnerContextOptions) {
	return {
		supabase: (opts?.supabase as SupabaseClient) ?? null,
	};
}

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
	const supabase = createPagesServerClient(opts);
	const contextInner = await createContextInner({ supabase });
	return {
		...contextInner,
		req: opts.req,
		res: opts.res,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
