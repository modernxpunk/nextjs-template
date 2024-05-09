import { formatDate, humanize } from "@/lib/date";
import { getTranslations } from "next-intl/server";
import Example from "./example";
import { Metadata } from "next";
import { trpcServer } from "@/app/trpc/server-client";

export const metadata: Metadata = {
	title: "Hello World",
	description: "Hello world",
	openGraph: {
		title: "Hello World",
		description: "Hello World",
	},
};

const Home = async () => {
	const t = await getTranslations("Index");

	const greetings = await trpcServer.greetings();
	console.log(greetings);

	return (
		<div className="container flex flex-col gap-10">
			<div className="flex-1">
				<p className="text-2xl">Typography</p>
				<div className="flex flex-col gap-3">
					<div>
						<p className="text-xs opacity-60">text-4xl</p>
						<p className="text-4xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-3xl</p>
						<p className="text-3xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-2xl</p>
						<p className="text-2xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-xl</p>
						<p className="text-xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-lg</p>
						<p className="text-lg">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-base</p>
						<p className="text-base">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-sm</p>
						<p className="text-sm">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-xs</p>
						<p className="text-xs">{t("title")}</p>
					</div>
				</div>
			</div>
			<div>
				<p className="text-2xl">Buttons</p>
				<div className="flex flex-col gap-2">
					<div className="flex flex-wrap gap-3">
						<div>
							<p className="text-xs opacity-60">default</p>
							<button className="btn">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">primary</p>
							<button className="btn btn-primary">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">secondary</p>
							<button className="btn btn-secondary">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">accent</p>
							<button className="btn btn-accent">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">success</p>
							<button className="btn btn-success">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">info</p>
							<button className="btn btn-info">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">warning</p>
							<button className="btn btn-warning">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">error</p>
							<button className="btn btn-error">{t("title")}</button>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<div>
							<p className="text-xs opacity-60">xs</p>
							<button className="btn btn-xs">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">sm</p>
							<button className="btn btn-sm">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">md</p>
							<button className="btn btn-md">{t("title")}</button>
						</div>
						<div>
							<p className="text-xs opacity-60">lg</p>
							<button className="btn btn-lg">{t("title")}</button>
						</div>
					</div>
				</div>
			</div>
			<Example />
			<div>
				<p className="text-2xl">Date</p>
				<p>{humanize(48, "hours")}</p>
				<p>{formatDate(new Date(), "L LT")}</p>
			</div>
		</div>
	);
};

export default Home;
