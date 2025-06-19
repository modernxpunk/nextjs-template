import Icon from "@/components/icon";
import "@/globals.css";
import { getLocale, getTranslations } from "next-intl/server";
import type { PropsWithChildren } from "react";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import DropdownTheme from "@/components/dropdown-theme";
import ConnectWalletButton from "@/components/connect-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProfileButton from "@/components/profile-button";
import LocaleSwitch from "@/components/locale-switch";

export default async function RootLayout({ children }: PropsWithChildren) {
	const t = await getTranslations("home");
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<div className="flex flex-col min-h-screen">
						<div className="bg-base-200 navbar">
							<header className="container flex justify-between py-2">
								<nav className="flex items-center gap-2">
									<DropdownTheme />
									<ProfileButton />
									<ConnectWalletButton />
									<LocaleSwitch />
								</nav>
							</header>
							<hr />
						</div>
						<main className="flex-1">{children}</main>
						<footer className="bg-base-200">
							<div className="container flex items-center justify-between p-4">
								<aside className="flex items-center gap-2">
									<Button variant="ghost" size="icon">
										<Icon name="common/logo" />
									</Button>
									<p>{t("copyright")}</p>
								</aside>
								<nav className="flex justify-self-center">
									<Link
										href="https://discord.com"
										target="_blank"
										rel="noreferrer"
									>
										<Button variant="ghost" size="icon">
											<Icon name="socials/discord" />
										</Button>
									</Link>
									<Link
										href="https://facebook.com"
										target="_blank"
										rel="noreferrer"
									>
										<Button variant="ghost" size="icon">
											<Icon name="socials/facebook" />
										</Button>
									</Link>
									<Link
										href="https://github.com"
										target="_blank"
										rel="noreferrer"
									>
										<Button variant="ghost" size="icon">
											<Icon name="socials/github" />
										</Button>
									</Link>
									<Link
										href="https://twitter.com"
										target="_blank"
										rel="noreferrer"
									>
										<Button variant="ghost" size="icon">
											<Icon name="socials/twitter" />
										</Button>
									</Link>
								</nav>
							</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
