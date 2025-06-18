"use client";

import { locales, type Locale } from "@/lib/i18n/config";
import { setUserLocale } from "@/lib/i18n/locale";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
					<Button variant="outline" size="sm">
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
