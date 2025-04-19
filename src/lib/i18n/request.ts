import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";
import { formats } from "./config";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();
	const messages = (await import(`../../../messages/${locale}.json`)).default;
	return {
		locale,
		messages,
		formats,
	};
});
