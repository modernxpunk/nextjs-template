import { betterFetch } from "@better-fetch/fetch";
import { type NextRequest, NextResponse } from "next/server";
import type { Session } from "@/lib/auth";

const REDIRECT_IF_UNAUTHENTICATED = "/auth/sign-in";
const REDIRECT_IF_AUTHENTICATED = "/";

const getIsGuestOnlyRoutes = (pathname: string) => {
	return pathname.startsWith("/auth");
};

export async function middleware(request: NextRequest) {
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		},
	);

	const isGuestOnlyRoutes = getIsGuestOnlyRoutes(request.nextUrl.pathname);

	if (session && isGuestOnlyRoutes) {
		return NextResponse.redirect(
			new URL(REDIRECT_IF_AUTHENTICATED, request.url),
		);
	}

	if (!(session || isGuestOnlyRoutes)) {
		return NextResponse.redirect(
			new URL(REDIRECT_IF_UNAUTHENTICATED, request.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
