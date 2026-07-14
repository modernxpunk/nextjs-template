export async function getResponseErrorMessage(
	response: Response,
	fallback: string,
): Promise<string> {
	try {
		const body: unknown = await response.json();
		if (
			typeof body === "object" &&
			body !== null &&
			"message" in body &&
			typeof body.message === "string"
		) {
			return body.message;
		}
	} catch {
		// The response may not contain JSON.
	}

	return fallback;
}
