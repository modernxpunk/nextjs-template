"use server";

import Negotiator from "negotiator";
import { cookies, headers } from "next/headers";
import {
	defaultLocale,
	isLocale,
	type Locale,
	locales,
} from "@/lib/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

// Read "locale" from cookie, otherwise from Accept-Language header
export const getUserLocale = async () => {
	const localeCookie = (await cookies()).get(COOKIE_NAME)?.value;
	if (localeCookie && isLocale(localeCookie)) {
		return localeCookie;
	}

	const headersObject = Object.fromEntries((await headers()).entries());
	const negotiator = new Negotiator({ headers: headersObject });
	const detected = negotiator.language([...locales]);
	const locale: Locale =
		detected && isLocale(detected) ? detected : defaultLocale;

	return locale;
};

export async function setUserLocale(locale: string) {
	if (!isLocale(locale)) {
		throw new Error(`Unsupported locale: ${locale}`);
	}

	(await cookies()).set(COOKIE_NAME, locale, {
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}
