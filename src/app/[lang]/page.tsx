import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-directories";
import type { Locale } from "@/utils/i18n";

const Home = async ({ params: { lang } }: { params: { lang: Locale } }) => {
	const i = await getDictionary(lang);

	console.log(i);

	return (
		<div className="container">
			<Button>{i.products.cart}</Button>
		</div>
	);
};

export default Home;
