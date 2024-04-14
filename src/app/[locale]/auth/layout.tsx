import { type ReactNode } from "react";
import "@/globals.css";
import { I18nProviderClient } from "@/locales/client";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { fontsVariables } from "@/utils/font";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html suppressHydrationWarning>
			<body className={cn(fontsVariables.join(" "), "font-sans")}>
				<ThemeProvider>
					<I18nProviderClient locale="en">
						<div className="flex min-h-screen p-6 bg-base-300">
							<div className="flex flex-1 rounded-2xl bg-base-100">
								<div className="flex-1 rounded-l-[inherit] bg-base-200"></div>
								<div className="flex items-center justify-center flex-1">
									<div className="w-full max-w-sm p-4 rounded-lg bg-base-200">
										{children}
									</div>
								</div>
							</div>
						</div>
					</I18nProviderClient>
				</ThemeProvider>
			</body>
		</html>
	);
}
