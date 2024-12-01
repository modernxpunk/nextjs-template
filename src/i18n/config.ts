export type Locale = (typeof locales)[number];

// TODO: "locales" just duplicated names in the /messages folder
export const locales = ["en", "uk"] as const;
export const defaultLocale: Locale = "en";
