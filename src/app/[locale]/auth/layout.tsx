import { type ReactNode } from "react";
import "@/globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { fontsVariables } from "@/lib/font";
import Image from "next/image";
import { NextIntlClientProvider, useMessages } from "next-intl";
import dayjs from "dayjs";

export default function RootLayout({
	children,
	params: { locale },
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	const messages = useMessages();
	dayjs.locale(locale);
	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "font-sans")}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ThemeProvider>
						<div className="flex min-h-screen p-6 bg-base-300">
							<div className="flex flex-col flex-1 lg:flex-row rounded-2xl bg-base-100">
								<div className="flex-1 rounded-l-[inherit] relative">
									<Image
										className="object-cover rounded-[inherit]"
										fill
										src="https://picsum.photos/900/1300"
										alt="background"
									/>
									<div className="absolute inset-0 bg-opacity-80 bg-base-200" />
								</div>
								<div className="flex items-center justify-center flex-1 p-4">
									<div className="w-full max-w-sm p-4 rounded-lg bg-base-200">
										{children}
									</div>
								</div>
							</div>
						</div>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
