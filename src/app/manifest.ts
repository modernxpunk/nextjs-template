import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Next.js App",
		short_name: "Next.js App",
		description: "Next.js App",
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/android-chrome-256x256.png",
				sizes: "256x256",
				type: "image/png",
			},
		],
	};
}
