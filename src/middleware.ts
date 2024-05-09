import createMiddleware from "next-intl/middleware";
import { configLocale } from "@/lib/i18n/config";

export default createMiddleware({
	defaultLocale: "en",
	...configLocale,
});

export const config = {
	matcher: ["/", "/(ua|en)/:path*", "/((?!_next|_vercel|api|.*\\..*).*)"],
};
