"use client";

import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type Locale, locales } from "@/lib/i18n/config";
import { setUserLocale } from "@/lib/i18n/locale";

const LocaleSwitch = () => {
	const locale = useLocale() as Locale;
	const t = useTranslations("languages");

	const changeLanguage = async (newLocale: Locale) => {
		setUserLocale(newLocale);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div>
					<Button size="sm" variant="outline">
						<Languages /> {t(locale)}
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{locales.map((locale) => {
					return (
						<DropdownMenuItem
							key={locale}
							onClick={() => changeLanguage(locale)}
						>
							{t(locale)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LocaleSwitch;
