"use server";

import { cookies, headers } from "next/headers";
import { type Locale, defaultLocale, locales } from "@/lib/i18n/config";
import Negotiator from "negotiator";

const COOKIE_NAME = "NEXT_LOCALE";

// Read "locale" from cookie, otherwise from Accept-Language header
export const getUserLocale = async () => {
	const localeCookie = (await cookies()).get(COOKIE_NAME)?.value;
	if (localeCookie) {
		return localeCookie;
	}

	const headersObject = Object.fromEntries((await headers()).entries());
	const negotiator = new Negotiator({ headers: headersObject });
	const locale = negotiator.language([...locales]) || defaultLocale;

	return locale;
};

export async function setUserLocale(locale: Locale) {
	(await cookies()).set(COOKIE_NAME, locale);
}
