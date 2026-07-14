import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";
import { isAdminRole } from "@/lib/auth-roles";
import {
	isSessionResponse,
	type SessionResponse,
} from "@/lib/session-response";

const REDIRECT_IF_UNAUTHENTICATED = "/auth/sign-in";
const REDIRECT_IF_AUTHENTICATED = "/";

const isPathWithin = (pathname: string, prefix: string) => {
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

const getIsAdminRoute = (pathname: string) => {
	return isPathWithin(pathname, "/admin");
};

export async function proxy(request: NextRequest) {
	let session: SessionResponse | null = null;
	try {
		const response = await fetch(`${env.API_URL}/api/auth/get-session`, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-store",
			signal: AbortSignal.timeout(5000),
		});

		if (response.ok) {
			const body: unknown = await response.json();
			session = isSessionResponse(body) ? body : null;
		}
	} catch {
		// API may be temporarily unavailable during startup/redeploy.
		session = null;
	}

	const isGuestOnlyRoutes = isPathWithin(request.nextUrl.pathname, "/auth");
	const isAdminRoute = getIsAdminRoute(request.nextUrl.pathname);

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

	if (isAdminRoute && !isAdminRole(session?.user?.role)) {
		return NextResponse.redirect(
			new URL(REDIRECT_IF_AUTHENTICATED, request.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
