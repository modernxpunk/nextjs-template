import "server-only";
import type { Locale } from "@/utils/i18n";

const dictionaries = {
	en: () =>
		import("../public/directories/en.json").then((module) => module.default),
	ru: () =>
		import("../public/directories/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
	dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en();
