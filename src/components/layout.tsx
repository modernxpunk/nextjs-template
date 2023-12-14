import { ReactNode } from "react";
import { Montserrat, Roboto } from "next/font/google";

const roboto = Roboto({
	subsets: ["latin"],
	variable: "--font-roboto",
	weight: ["300", "500", "700"],
});

const monserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	weight: ["300", "500", "700"],
});

const fontsVariables = [roboto.variable, monserrat.variable];

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div
			className={`flex flex-col min-h-screen ${fontsVariables
				.join(",")
				.replaceAll(",", " ")} font-sans`}
		>
			<header>
				<nav></nav>
			</header>
			<main className="flex-1">{children}</main>
			<footer></footer>
		</div>
	);
};

export default Layout;
