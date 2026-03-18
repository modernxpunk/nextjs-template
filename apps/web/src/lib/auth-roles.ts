export type RoleValue = string | string[] | null | undefined;

const splitAndNormalize = (value: string): string[] => {
	return value
		.split(",")
		.map((role) => role.trim())
		.filter(Boolean);
};

export const normalizeRoles = (role: RoleValue): string[] => {
	if (!role) {
		return [];
	}

	if (Array.isArray(role)) {
		return role.flatMap(splitAndNormalize);
	}

	return splitAndNormalize(role);
};

export const hasRole = (role: RoleValue, roleToCheck: string): boolean => {
	return normalizeRoles(role).includes(roleToCheck);
};

export const isAdminRole = (role: RoleValue): boolean => {
	return hasRole(role, "admin");
};

export const getPrimaryRole = (role: RoleValue): string => {
	return normalizeRoles(role)[0] ?? "user";
};
