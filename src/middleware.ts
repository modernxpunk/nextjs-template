import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const reqUrl = new URL(req.url);
	const code = reqUrl.searchParams.get("code");
	const supabase = createMiddlewareClient({ req, res });

	if (code) {
		try {
			const {
				data: { session },
			} = await supabase.auth.exchangeCodeForSession(code);
			if (session?.user.email && req.nextUrl.pathname === "/auth") {
				return NextResponse.redirect(new URL("/", req.url));
			}
			if (!session?.user.email && req.nextUrl.pathname !== "/auth") {
				return NextResponse.redirect(new URL("/auth", req.url));
			}
		} catch (err) {
			return NextResponse.redirect(new URL("/auth", req.url));
		}
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session?.user.email && req.nextUrl.pathname === "/auth") {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (!session?.user.email && req.nextUrl.pathname !== "/auth") {
		return NextResponse.redirect(new URL("/auth", req.url));
	}

	return res;
}
export const config = {
	matcher: ["/", "/auth"],
};
