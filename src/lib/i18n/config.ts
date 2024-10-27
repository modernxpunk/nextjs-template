import { Locale } from "@/types";
import "server-only";

export const i18n = {
	defaultLocale: "en",
	locales: ["en", "uk"],
} as const;

// type Dictionaries = {
// 	[key in (typeof availableLanguages)[number]]: () => Promise<typeof en>;
// };

// const dictionaries: Dictionaries = availableLanguages.reduce((acc, lang) => {
// 	acc[lang] = () =>
// 		import(`../dictionaries/${lang}.json`).then((module) => module.default);
// 	return acc;
// }, {} as Dictionaries);

// TODO: generate object from availableLanguages but not importing one of dictionaries to create type
const dictionaries = {
	en: () => import("./dictionaries/en.json").then((module) => module.default),
	uk: () => import("./dictionaries/uk.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
	await dictionaries[locale]?.();
