import { ReactNode } from "react";
import { fontsVariables } from "@/utils/font";

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
