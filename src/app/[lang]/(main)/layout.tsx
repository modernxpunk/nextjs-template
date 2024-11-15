import DropdownTheme from "@/components/dropdown-theme";
import Icon from "@/components/icon";
import LocaleSwitcher from "@/components/locale-switch";
import "@/globals.css";
import { fontsVariables } from "@/lib/font";
import { i18n } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ThemeProvider } from "next-themes";
import Link from "next/link";

export async function generateStaticParams() {
	return i18n.locales.map((lang) => ({ lang }));
}

interface RootLayoutProps {
	children: React.ReactNode;
	params: { lang: string };
	modal?: React.ReactNode;
}

export default function RootLayout({
	children,
	params: { lang },
	modal,
}: RootLayoutProps) {
	dayjs.locale(lang);
	return (
		<html lang={lang}>
			<body className={cn(fontsVariables, "font-sans")}>
				<ThemeProvider>
					<div className="drawer drawer-end">
						<input id="my-drawer" type="checkbox" className="drawer-toggle" />
						<div className="flex flex-col min-h-screen drawer-content">
							<div className="bg-base-200 navbar">
								<header className="container flex justify-between">
									<Link href="/" className="btn btn-ghost btn-primary">
										<Icon className="text-3xl" name="common/logo" />
									</Link>
									<nav className="items-center hidden gap-2 lg:flex">
										<DropdownTheme />
										<LocaleSwitcher />
									</nav>
									<label
										htmlFor="my-drawer"
										className="flex drawer-button btn btn-circle btn-ghost lg:hidden"
									>
										<Icon className="text-3xl" name="common/menu" />
									</label>
								</header>
							</div>
							<main className="flex-1 my-2">{children}</main>
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
										<a
											href="https://github.com"
											target="_blank"
											rel="noreferrer"
										>
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
						<div className="drawer-side">
							<label
								htmlFor="my-drawer"
								aria-label="close sidebar"
								className="drawer-overlay"
							/>
							<ul className="min-h-full p-4 menu w-80 bg-base-200 text-base-content">
								{/* Sidebar content here */}
								<li>
									<a href="#">Sidebar Item 1</a>
								</li>
								<li>
									<a href="#">Sidebar Item 2</a>
								</li>
							</ul>
						</div>
					</div>
				</ThemeProvider>
				{modal}
			</body>
		</html>
	);
}
