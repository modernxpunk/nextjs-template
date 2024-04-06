"use client";

import Icon from "@/components/icon";
import { useChangeLocale, useI18n } from "@/locales/client";
import { useRef, useEffect } from "react";

const LocaleSwitcher = () => {
	const t = useI18n();

	// const locale = useCurrentLocale();
	const changeLocale = useChangeLocale({ preserveSearchParams: true });
	const detailsRef = useRef<HTMLDetailsElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				detailsRef.current &&
				!detailsRef.current.contains(event.target as Node)
			) {
				detailsRef.current.open = false;
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<details ref={detailsRef} className="dropdown dropdown-end">
			<summary className="btn">
				<Icon className="text-lg" name="common/translate" />
				<Icon name="common/chevron-down" />
			</summary>
			<div className="p-2 shadow menu mt-4 dropdown-content z-[1] bg-base-200 rounded-box w-52">
				<button className="btn" onClick={() => changeLocale("en")}>
					{t("languages.en")}
				</button>
				<button className="btn" onClick={() => changeLocale("ua")}>
					{t("languages.ua")}
				</button>
			</div>
		</details>
	);
};

export default LocaleSwitcher;
