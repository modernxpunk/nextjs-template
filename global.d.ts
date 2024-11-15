import type en from "./src/lib/i18n/dictionary/en.json";

type Messages = typeof en;

declare global {
	interface IntlMessages extends Messages {}
}
