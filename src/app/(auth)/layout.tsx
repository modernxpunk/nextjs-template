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
					<div className="flex flex-col min-h-screen">
						<div className="flex flex-1">
							<div className="flex-1 p-2 bg-base-200" />
							<div className="flex items-center justify-center flex-1 p-2">
								<div className="w-full p-6 rounded-lg shadow-md max-w-96 bg-base-300">
									{children}
								</div>
							</div>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
