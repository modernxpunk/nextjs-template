export function extractOwnedStorageKey(
	fileUrl: string,
	publicBaseUrl: string,
	bucket: string,
): string | null {
	try {
		const candidateUrl = new URL(fileUrl);
		const baseUrl = new URL(publicBaseUrl);
		if (candidateUrl.origin !== baseUrl.origin) return null;

		const basePath = baseUrl.pathname.replace(/\/+$/, "");
		const bucketPrefix = `${basePath}/${bucket}/`.replace(/\/{2,}/g, "/");
		if (!candidateUrl.pathname.startsWith(bucketPrefix)) return null;

		const key = decodeURIComponent(
			candidateUrl.pathname.slice(bucketPrefix.length),
		);
		const segments = key.split("/");
		if (!key || segments.some((segment) => segment === "..")) return null;

		return key;
	} catch {
		return null;
	}
}
