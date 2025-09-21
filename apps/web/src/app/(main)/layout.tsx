import "@repo/ui/globals.css";
import { getLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";
import LocaleSwitch from "@/components/locale-switch";
import ProfileButton from "@/components/profile-button";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

export default async function RootLayout({ children }: PropsWithChildren) {
	const locale = await getLocale();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<nav className="flex items-center gap-2 justify-end p-2">
						<LocaleSwitch />
						<ProfileButton />
					</nav>
					<main className="flex-1">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
