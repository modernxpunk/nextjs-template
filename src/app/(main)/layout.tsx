import "@/globals.css";
import type { PropsWithChildren } from "react";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import Providers from "@/providers";

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={cn(fontsVariables, "font-sans")}>
				<Providers>
					<div className="flex flex-col min-h-screen">
						<main className="flex-1">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
