import "@/globals.css";
import { fontsVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Telegram Web",
	description:
		"Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.",
	applicationName: "Telegram Web",
	appleWebApp: {
		capable: true,
		title: "Telegram Web",
		statusBarStyle: "default",
	},
	other: {
		google: "notranslate",
		"mobile-web-app-capable": "yes",
		"msapplication-TileColor": "#2b5797",
		"msapplication-config": "/browserconfig.xml",
	},
	openGraph: {
		type: "website",
		url: "https://web.telegram.org/",
		title: "Telegram Web",
		description:
			"Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.",
		images: [
			{
				url: "/app-192x192.png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Telegram Web",
		description:
			"Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.",
		images: ["/app-192x192.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/app-192x192.png", sizes: "192x192", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon-180x180.png", sizes: "180x180" }],
		other: [
			{ rel: "alternate icon", url: "/favicon.ico" },
			{ rel: "manifest", url: "/manifest.json" },
			{ rel: "canonical", url: "https://web.telegram.org/" },
		],
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<body className={cn(fontsVariables, "font-sans")}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
