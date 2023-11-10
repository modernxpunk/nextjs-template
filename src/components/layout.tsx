import { cx } from "class-variance-authority";
import { ReactNode } from "react";
import { fontsVariables } from "@/utils/font";

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div
			className={cx(
				"flex flex-col min-h-screen overflow-hidden",
				fontsVariables.map((fontVariable: string) => fontVariable),
				"font-sans",
			)}
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
