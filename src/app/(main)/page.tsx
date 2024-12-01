"use client";

import { formatDate, humanize } from "@/lib/date";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Page = () => {
	const t = useTranslations("home");

	return (
		<div className="container flex flex-col gap-10">
			<div>
				<p className="text-2xl">Date</p>
				<p>{humanize(48, "hours")}</p>
				<p>{t("greetings")}</p>
				<Link scroll={false} href="/movies">
					movies
				</Link>
				<p>{formatDate(new Date(), "L LT")}</p>
			</div>
		</div>
	);
};

export default Page;
