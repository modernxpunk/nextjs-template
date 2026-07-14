"use client";

import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { env } from "@/env/client";
import type { ItemDto } from "@/lib/api/generated";
import { useSession } from "@/lib/auth-client";
import { getResponseErrorMessage } from "@/lib/http";

const ITEMS_QUERY_KEY = ["items"] as const;

function isItemDto(value: unknown): value is ItemDto {
	return (
		typeof value === "object" &&
		value !== null &&
		"id" in value &&
		typeof value.id === "string" &&
		"name" in value &&
		typeof value.name === "string" &&
		"userId" in value &&
		typeof value.userId === "string"
	);
}

const Page = () => {
	const t = useTranslations("home");
	const apiUrl = env.NEXT_PUBLIC_API_URL;
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const [name, setName] = useState("");

	const itemsQuery = useQuery<ItemDto[]>({
		queryKey: ITEMS_QUERY_KEY,
		queryFn: async () => {
			const response = await fetch(`${apiUrl}/api/items`, {
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error(
					await getResponseErrorMessage(response, t("loadError")),
				);
			}
			const body: unknown = await response.json();
			if (!Array.isArray(body) || !body.every(isItemDto)) {
				throw new Error(t("invalidResponse"));
			}
			return body;
		},
	});

	const createItem = useMutation({
		mutationFn: async (itemName: string) => {
			const response = await fetch(`${apiUrl}/api/items`, {
				method: "POST",
				credentials: "include",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ name: itemName }),
			});
			if (!response.ok) {
				throw new Error(
					await getResponseErrorMessage(response, t("createError")),
				);
			}
			const body: unknown = await response.json();
			if (!isItemDto(body)) throw new Error(t("invalidResponse"));
			return body;
		},
		onSuccess: (createdItem) => {
			queryClient.setQueryData<ItemDto[]>(ITEMS_QUERY_KEY, (items = []) => [
				...items,
				createdItem,
			]);
			setName("");
		},
	});

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const itemName = name.trim();
		if (itemName) createItem.mutate(itemName);
	};

	return (
		<div className="container mx-auto max-w-3xl px-4 py-10">
			<Card>
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
					<CardDescription>
						{t("welcome", {
							name: session?.user.name || session?.user.email || "",
						})}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<form className="flex items-end gap-3" onSubmit={handleSubmit}>
						<div className="flex-1 space-y-2">
							<Label htmlFor="item-name">{t("itemName")}</Label>
							<Input
								autoComplete="off"
								id="item-name"
								maxLength={20}
								name="itemName"
								onChange={(event) => setName(event.target.value)}
								value={name}
							/>
						</div>
						<Button
							disabled={!name.trim() || createItem.isPending}
							type="submit"
						>
							{t("createItem")}
						</Button>
					</form>

					<div aria-live="polite">
						{itemsQuery.isPending ? (
							<p className="text-muted-foreground text-sm">{t("loading")}</p>
						) : itemsQuery.error ? (
							<p className="text-destructive text-sm" role="alert">
								{itemsQuery.error.message}
							</p>
						) : itemsQuery.data.length === 0 ? (
							<p className="text-muted-foreground text-sm">{t("empty")}</p>
						) : (
							<ul className="divide-y rounded-md border">
								{itemsQuery.data.map((item) => (
									<li className="px-4 py-3" key={item.id}>
										{item.name}
									</li>
								))}
							</ul>
						)}
						{createItem.error ? (
							<p className="mt-3 text-destructive text-sm" role="alert">
								{createItem.error.message}
							</p>
						) : null}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Page;
