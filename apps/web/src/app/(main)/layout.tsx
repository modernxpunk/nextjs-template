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
			<body
				className={cn(fontsVariables, "flex min-h-screen flex-col font-sans")}
			>
				<Providers>
					<a
						className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
						href="#main-content"
					>
						Skip to content
					</a>
					<nav
						aria-label="Primary navigation"
						className="container flex items-center justify-end gap-2 p-2"
					>
						<LocaleSwitch />
						<ProfileButton />
					</nav>
					<main className="flex-1" id="main-content">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
