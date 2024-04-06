"use client";

import { useChangeLocale, useCurrentLocale } from "@/locales/client";

const LocaleSwitcher = () => {
	const locale = useCurrentLocale();
	const changeLocale = useChangeLocale({ preserveSearchParams: true });

	return (
		<div className="join">
			{locale}
			<button className="btn join-item" onClick={() => changeLocale("en")}>
				English
			</button>
			<button className="btn join-item" onClick={() => changeLocale("ru")}>
				Русский
			</button>
		</div>
	);
};

export default LocaleSwitcher;
