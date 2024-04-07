import { I18nProviderClient } from "@/locales/client";
import { ReactElement } from "react";

export default function SubLayout({ children }: { children: ReactElement }) {
	return <I18nProviderClient locale="en">{children}</I18nProviderClient>;
}
