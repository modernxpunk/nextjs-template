import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import {
	Pathnames,
	createLocalizedPathnamesNavigation,
} from "next-intl/navigation";

const locales = ["en", "uk"] as const;

export const configLocale = {
	locales: locales,
	pathnames: {
		"/": "/",
	} satisfies Pathnames<typeof locales>,
	localePrefix: undefined,
};

export default getRequestConfig(async ({ locale }) => {
	if (!configLocale.locales.includes(locale as any)) notFound();
	return {
		messages: (
			await (locale === "en"
				? import("./dictionary/en.json")
				: import(`./dictionary/${locale}.json`))
		).default,
	};
});

export type AppPathnames = keyof typeof configLocale.pathnames;

export const { Link, redirect, usePathname, useRouter } =
	createLocalizedPathnamesNavigation(configLocale);
