import { getRequestConfig } from "next-intl/server";
import { formats } from "@/lib/i18n/config";
import { getUserLocale } from "@/lib/i18n/locale";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();
	const messages = (await import(`./messages/${locale}.json`)).default;
	return {
		locale,
		messages,
		formats,
	};
});
