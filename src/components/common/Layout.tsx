import { cx } from "class-variance-authority";
import { ReactNode } from "react";
import { monserrat, roboto } from "src/pages/_app";

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div
			className={cx(
				"flex flex-col min-h-screen overflow-hidden",
				roboto.variable,
				monserrat.variable,
				"font-sans"
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
