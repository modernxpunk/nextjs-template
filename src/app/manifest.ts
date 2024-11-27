import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Telegram Web",
		short_name: "Telegram Web",
		description:
			"Telegram is a cloud-based mobile and desktop messaging app with a focus on security and speed.",
		start_url: "/",
		icons: [
			{
				src: "icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "icon-384x384.png",
				sizes: "384x384",
				type: "image/png",
			},
			{
				src: "icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		theme_color: "#ffffff",
		background_color: "#ffffff",
		display: "standalone",
	};
}
