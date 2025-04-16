import "@/globals.css";
import { getLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

export default async function RootLayout({ children }: PropsWithChildren) {
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<div className="flex flex-col items-center justify-center min-h-screen">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
