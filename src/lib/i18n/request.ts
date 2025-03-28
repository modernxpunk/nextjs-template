import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";
import { formats } from "./config";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();
	return {
		locale,
		messages: (await import(`../../../messages/${locale}.json`)).default,
		formats,
	};
});
