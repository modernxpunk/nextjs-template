export type Locale = (typeof locales)[number];

// TODO: "locales" just duplicated names in the /messages folder
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
} as const;
