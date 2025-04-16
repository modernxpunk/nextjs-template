import Icon from "@/components/icon";
import "@/globals.css";
import { getLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import DropdownTheme from "@/components/dropdown-theme";

export default async function RootLayout({ children }: PropsWithChildren) {
	const locale = await getLocale();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<div className="flex flex-col min-h-screen">
						<div className="bg-base-200 navbar">
							<header className="container flex justify-between">
								<nav className="flex items-center gap-2">
									<DropdownTheme />
								</nav>
							</header>
						</div>
						<main className="flex-1">{children}</main>
						<footer className="bg-base-200">
							<div className="container flex items-center justify-between p-4">
								<aside className="flex items-center gap-2">
									<Icon className="text-3xl" name="common/logo" />
									<p>Copyright © 2024 - All right reserved</p>
								</aside>
								<nav className="flex justify-self-center">
									<a
										href="https://discord.com"
										target="_blank"
										rel="noreferrer"
									>
										<button className="text-2xl btn btn-circle btn-ghost">
											<Icon name="socials/discord" />
										</button>
									</a>
									<a
										href="https://facebook.com"
										target="_blank"
										rel="noreferrer"
									>
										<button className="text-2xl btn btn-circle btn-ghost">
											<Icon name="socials/facebook" />
										</button>
									</a>
									<a href="https://github.com" target="_blank" rel="noreferrer">
										<button className="text-2xl btn btn-circle btn-ghost">
											<Icon name="socials/github" />
										</button>
									</a>
									<a
										href="https://twitter.com"
										target="_blank"
										rel="noreferrer"
									>
										<button className="text-2xl btn btn-circle btn-ghost">
											<Icon name="socials/twitter" />
										</button>
									</a>
								</nav>
							</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
