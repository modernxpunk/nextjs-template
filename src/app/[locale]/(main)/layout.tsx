import ModalBuilder from "@/components/modal/builder";
import { fontsVariables } from "@/lib/font";
import Link from "next/link";
import { type ReactNode } from "react";
import "@/globals.css";
import LocaleSwitcher from "@/components/locale-switch";
import DropdownTheme from "@/components/dropdown-theme";
import { ThemeProvider } from "next-themes";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import Provider from "@/app/trpc/provider";

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	dayjs.locale(locale);
	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "font-sans")}>
				<Provider>
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
											<Link className="btn btn-ghost" href="/auth/sign-in">
												login
											</Link>
											<Link className="btn btn-primary" href="/auth/sign-up">
												sign up
											</Link>
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
											<a href="https://discord.com" target="_blank">
												<button className="text-2xl btn btn-circle btn-ghost">
													<Icon name="socials/discord" />
												</button>
											</a>
											<a href="https://facebook.com" target="_blank">
												<button className="text-2xl btn btn-circle btn-ghost">
													<Icon name="socials/facebook" />
												</button>
											</a>
											<a href="https://github.com" target="_blank">
												<button className="text-2xl btn btn-circle btn-ghost">
													<Icon name="socials/github" />
												</button>
											</a>
											<a href="https://twitter.com" target="_blank">
												<button className="text-2xl btn btn-circle btn-ghost">
													<Icon name="socials/twitter" />
												</button>
											</a>
										</nav>
									</div>
								</footer>
								<ModalBuilder />
							</div>
							<div className="drawer-side">
								<label
									htmlFor="my-drawer"
									aria-label="close sidebar"
									className="drawer-overlay"
								></label>
								<ul className="min-h-full p-4 menu w-80 bg-base-200 text-base-content">
									{/* Sidebar content here */}
									<li>
										<a>Sidebar Item 1</a>
									</li>
									<li>
										<a>Sidebar Item 2</a>
									</li>
								</ul>
							</div>
						</div>
					</ThemeProvider>
				</Provider>
			</body>
		</html>
	);
}
