import { i18n } from "@/lib/i18n/config";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// TODO: delete negotiator
function getLocale(request: NextRequest) {
	const negotiatorHeaders: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		negotiatorHeaders[key] = value;
	});

	const negotiator = new Negotiator({ headers: negotiatorHeaders });
	const preferredLang =
		negotiator.language([...i18n.locales]) || i18n.defaultLocale;

	return preferredLang;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = i18n.locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) return;

	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;

	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: "/((?!api|static|.*\\..*|_next).*)",
};
