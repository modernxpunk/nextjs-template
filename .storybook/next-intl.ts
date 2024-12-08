import en from "../messages/en.json";
import ua from "../messages/uk.json";

const messagesByLocale: Record<string, any> = { en, ua };

const nextIntl = {
	defaultLocale: "en",
	messagesByLocale,
};

export default nextIntl;
