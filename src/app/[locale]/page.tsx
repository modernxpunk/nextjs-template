import { Button } from "@/components/ui/button";
import { getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export function generateStaticParams() {
	return getStaticParams();
}

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
	setStaticParamsLocale(locale);

	const t = await getI18n();

	return (
		<div className="container">
			<Button>{t("products.cart")}</Button>
		</div>
	);
};

export default Home;
