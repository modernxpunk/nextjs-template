"use client";

import { formatDate } from "@/lib/date";
import { useLocale, useNow, useTranslations } from "next-intl";
import { useFormatter } from "next-intl";
import { useTimeZone } from "next-intl";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn, signOut, signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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

	const { data: all_items, refetch } = useQuery({
		queryKey: ["items"],
		queryFn: async () => {
			const res = await fetch("/api/items");
			const data = await res.json();
			return data;
		},
	});

	// mutate
	const mutation = useMutation({
		mutationFn: async ({ name }: { name: string }) => {
			const res = await fetch("/api/items", {
				method: "POST",
				body: JSON.stringify({
					userId: session?.user.id,
					name,
				}),
			});
			const data = await res.json();
			await refetch();
			return data;
		},
	});

	const { data: session } = useSession();

	const router = useRouter();

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth/sign-in");
				},
			},
		});
	};

	const handleSignIn = async (email: string, password: string) => {
		await signIn.email({
			email: email,
			password: password,
		});
	};

	const handleSignUp = async (
		name: string,
		email: string,
		password: string,
	) => {
		await signUp.email({
			name: name,
			email: email,
			password: password,
		});
	};

	return (
		<div className="container flex flex-col gap-10">
			<div className="flex flex-col gap-4">
				<div>
					<h2>Session</h2>
					<pre>{JSON.stringify(session, null, 2)}</pre>
				</div>
				<div>
					<h2>Sign out</h2>
					<button className="btn" onClick={handleSignOut}>
						Sign out
					</button>
				</div>
			</div>
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
				<p>{formatDate(new Date(), "L LT")}</p>
			</div>
			<div>
				<Input placeholder="adsfasfd" />
			</div>
			<div>
				<button
					onClick={() =>
						mutation.mutate({
							name: Math.random().toString(36).substring(7),
						})
					}
				>
					mutate
				</button>
			</div>
			{all_items && (
				<div>
					{/* @ts-ignore */}
					{all_items.map((item) => (
						<div key={item.id}>{item.name}</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Page;
