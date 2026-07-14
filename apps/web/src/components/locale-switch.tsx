"use client";

import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { type Locale, locales } from "@/lib/i18n/config";
import { setUserLocale } from "@/lib/i18n/locale";

const LocaleSwitch = () => {
	const locale = useLocale();
	const t = useTranslations("languages");
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const changeLanguage = (newLocale: Locale) => {
		startTransition(async () => {
			await setUserLocale(newLocale);
			router.refresh();
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button disabled={isPending} size="sm" variant="outline">
					<Languages aria-hidden="true" /> {t(locale)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{locales.map((newLocale) => {
					return (
						<DropdownMenuItem
							disabled={isPending || locale === newLocale}
							key={newLocale}
							onClick={() => changeLanguage(newLocale)}
						>
							{t(newLocale)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LocaleSwitch;
