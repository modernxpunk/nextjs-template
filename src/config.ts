import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "uk"] as const;

export const pathnames = {
	"/": "/",
	"/pathnames": {
		en: "/pathnames",
		uk: "/pfadnamen",
	},
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
