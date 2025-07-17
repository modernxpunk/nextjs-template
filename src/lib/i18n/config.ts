import type { Formats } from "next-intl";
import type messages from "@/lib/i18n/messages/en.json";

export type Locale = (typeof locales)[number];

// Codes for locales are defined in https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
export const locales = ["en", "uk"] as const;
export const defaultLocale: Locale = "en";

export const formats = {
	dateTime: {
		short: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	number: {
		precise: {
			maximumFractionDigits: 5,
		},
	},
	list: {
		enumeration: {
			style: "long",
			type: "conjunction",
		},
	},
} satisfies Formats;

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof locales)[number];
		Messages: typeof messages;
		Formats: typeof formats;
	}
}
