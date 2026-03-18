import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env/server";

const REDIRECT_IF_UNAUTHENTICATED = "/auth/sign-in";
const REDIRECT_IF_AUTHENTICATED = "/";

const getIsGuestOnlyRoutes = (pathname: string) => {
	return pathname.startsWith("/auth");
};

export async function proxy(request: NextRequest) {
	let session: unknown = null;
	try {
		const response = await fetch(`${env.API_URL}/api/auth/get-session`, {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-store",
		});

		if (response.ok) {
			session = await response.json();
		}
	} catch {
		// API may be temporarily unavailable during startup/redeploy.
		session = null;
	}

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
