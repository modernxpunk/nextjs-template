import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@/lib/i18n/locale";
import { formats } from "@/lib/i18n/config";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();
	const messages = (await import(`./messages/${locale}.json`)).default;
	return {
		locale,
		messages,
		formats,
	};
});
