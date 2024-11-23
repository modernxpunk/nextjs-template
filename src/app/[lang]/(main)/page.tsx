import { formatDate, humanize } from "@/lib/date";
import { getDictionary } from "@/lib/i18n/config";
import type { PageWithLang } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Hello World",
	description: "Hello world",
	openGraph: {
		title: "Hello World",
		description: "Hello World",
	},
};

const Page: PageWithLang = async ({ params: { lang } }) => {
	const dict = await getDictionary(lang);

	return (
		<div className="container flex flex-col gap-10">
			<div>
				<p className="text-2xl">Date</p>
				<p>{dict.greetings}</p>
				<p>{humanize(48, "hours")}</p>
				<Link scroll={false} href="/movies">
					movies
				</Link>
				<p>{formatDate(new Date(), "L LT")}</p>
			</div>
		</div>
	);
};

export default Page;
