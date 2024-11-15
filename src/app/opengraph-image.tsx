import { ImageResponse } from "next/og";

export const alt = "About Acme";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div className="flex items-center justify-center w-full h-full text-4xl bg-white">
			About Acme
		</div>,
	);
}
