"use client";

import Icon from "@/components/icon";
import { useChangeLocale, useI18n } from "@/locales/client";
import { useRef } from "react";

const LocaleSwitcher = () => {
	const t = useI18n();

	const changeLocale = useChangeLocale({ preserveSearchParams: true });
	const detailsRef = useRef<HTMLDetailsElement | null>(null);

	return (
		<details ref={detailsRef} className="dropdown dropdown-end">
			<summary className="btn">
				<Icon className="text-lg" name="common/translate" />
				<Icon name="common/chevron-down" />
			</summary>
			<div className="p-2 shadow menu mt-4 dropdown-content z-[1] bg-base-200 rounded-box w-52">
				<button
					className="btn"
					onClick={() => {
						changeLocale("en");
						detailsRef.current && (detailsRef.current.open = false);
					}}
				>
					{t("languages.en")}
				</button>
				<button
					className="btn"
					onClick={() => {
						changeLocale("ua");
						detailsRef.current && (detailsRef.current.open = false);
					}}
				>
					{t("languages.ua")}
				</button>
			</div>
		</details>
	);
};

export default LocaleSwitcher;
