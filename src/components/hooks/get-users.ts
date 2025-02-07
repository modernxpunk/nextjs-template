"use client";

import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			return res.json();
		},
	});
};
