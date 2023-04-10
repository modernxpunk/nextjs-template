import { Roboto } from "next/font/google";
import { AppPropsWithLayout } from "src/types/common";
import "../styles/global.css";

export const roboto = Roboto({
	subsets: ["latin"],
	variable: "--font-roboto",
	weight: ["300", "500", "700"],
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	return getLayout(<Component {...pageProps} />);
}

export default MyApp;
