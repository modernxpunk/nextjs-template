export type SessionResponse = {
	user: {
		role?: string | string[] | null;
	};
};

export function isSessionResponse(value: unknown): value is SessionResponse {
	if (typeof value !== "object" || value === null || !("user" in value)) {
		return false;
	}

	const user = value.user;
	if (typeof user !== "object" || user === null) return false;
	if (!("role" in user) || user.role == null) return true;

	return (
		typeof user.role === "string" ||
		(Array.isArray(user.role) &&
			user.role.every((role) => typeof role === "string"))
	);
}
