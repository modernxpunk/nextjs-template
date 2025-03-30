"use client";

import { formatDate } from "@/lib/date";
import { useLocale, useNow, useTranslations } from "next-intl";
import Link from "next/link";
import { useFormatter } from "next-intl";
import { useTimeZone } from "next-intl";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";

const Page = () => {
	const t = useTranslations("home");
	const format = useFormatter();
	const dateTime = new Date("2020-11-20T10:36:01.516Z");
	const now = useNow();

	const dateTimeA = new Date("2020-11-20T08:30:00.000Z");
	const dateTimeB = new Date("2021-01-24T08:30:00.000Z");

	const items = ["HTML", "CSS", "JavaScript"];

	const locale = useLocale();

	const users = [
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
		{ id: 3, name: "Charlie" },
	];

	const usersItems = users.map((user) => (
		<a key={user.id} href={`/user/${user.id}`}>
			{user.name}
		</a>
	));

	const timeZone = useTimeZone();

	const { data: all_users, refetch } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			const data = await res.json();
			return data;
		},
	});

	// mutate
	const mutation = useMutation({
		mutationFn: async ({
			email,
			password,
		}: { email: string; password: string }) => {
			const res = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = await res.json();
			await refetch();
			return data;
		},
	});

	console.log("all_users", all_users);

	return (
		<div className="container flex flex-col gap-10">
			<p>{timeZone}</p>
			<div>
				<div>
					<p>{format.number(499.9, { style: "currency", currency: "USD" })}</p>
					<p>
						{t(
							"price",
							{ price: 32000.99 },
							{
								number: {
									currency: {
										style: "currency",
										currency: "EUR",
									},
								},
							},
						)}
					</p>
				</div>
				<div>
					<p>
						{format.dateTime(dateTime, {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</p>
					<p>
						{format.dateTime(dateTime, { hour: "numeric", minute: "numeric" })}
					</p>
					<p>{format.dateTime(dateTime, "short")}</p>
					<p>{format.relativeTime(dateTime)}</p>
					<p>{format.relativeTime(dateTime, now)}</p>
					<p>{format.relativeTime(dateTime, { now, unit: "day" })}</p>
					<p>
						{format.dateTimeRange(dateTimeA, dateTimeB, {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</p>
					<p>{format.dateTimeRange(dateTimeA, dateTimeB, "short")}</p>
					<p>
						{t(
							"ordered",
							{ orderDate: new Date("2020-11-20T10:36:01.516Z") },
							{
								dateTime: {
									short: {
										day: "numeric",
										month: "short",
										year: "numeric",
									},
								},
							},
						)}
					</p>
				</div>
				<div>
					<p>{format.list(items, { type: "conjunction" })}</p>
					<p>{format.list(items, { type: "disjunction" })}</p>
					<p>{format.list(usersItems)}</p>
				</div>
				<Link scroll={false} href="/movies">
					movies
				</Link>
				<p>{formatDate(new Date(), "L LT")}</p>
			</div>
			<div>
				<Input placeholder="adsfasfd" />
			</div>
			<div>
				<button
					onClick={() =>
						mutation.mutate({
							// biome-ignore lint/style/useTemplate: <explanation>
							email: Math.random().toString(36).substring(7) + "@example.com",
							password: "password123",
						})
					}
				>
					mutate
				</button>
			</div>
			{all_users && (
				<div>
					{/* @ts-ignore */}
					{all_users.map((user) => (
						<div key={user.id}>{user.email}</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Page;
