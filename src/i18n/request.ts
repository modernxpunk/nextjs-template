import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();
	console.log("locale", locale);
	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});
