export function parseWebOrigins(value: string | undefined): string[] {
	const origins = (value ?? "http://localhost:3000")
		.split(",")
		.map((origin) => origin.trim().replace(/\/+$/, ""))
		.filter(Boolean);

	for (const origin of origins) {
		const parsedOrigin = new URL(origin);
		if (parsedOrigin.origin !== origin) {
			throw new Error(`WEB_ORIGIN contains an invalid origin: ${origin}`);
		}
	}

	return [...new Set(origins)];
}

export const webOrigins = parseWebOrigins(process.env.WEB_ORIGIN);
