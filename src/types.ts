import type { i18n } from "@/lib/i18n/config";
import type { NextPage } from "next";

export type AvailableLanguages = (typeof i18n.locales)[number];

export type PageWithLang = NextPage<{ params: { lang: AvailableLanguages } }>;

export type Locale = (typeof i18n)["locales"][number];
