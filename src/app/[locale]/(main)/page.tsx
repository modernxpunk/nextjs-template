import { getTranslations } from "next-intl/server";

const Home = async () => {
	const t = await getTranslations("Index");

	return (
		<div className="container flex flex-col gap-10">
			<div className="flex-1">
				<p className="text-2xl">Typography</p>
				<div className="flex flex-col gap-3">
					<div>
						<p className="text-xs opacity-60">text-9xl</p>
						<p className="text-9xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-8xl</p>
						<p className="text-8xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-7xl</p>
						<p className="text-7xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-6xl</p>
						<p className="text-6xl">{t("title")}</p>
					</div>
					<div>
						<p className="text-xs opacity-60">text-5xl</p>
						<p className="text-5xl">{t("title")}</p>
					</div>
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
			{/* <Button>{t("products.cart")}</Button> */}
		</div>
	);
};

export default Home;
