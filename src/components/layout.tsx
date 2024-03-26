import { cx } from "class-variance-authority";
import { PropsWithChildren } from "react";
import { fontsVariables } from "@/utils/font";
import ModalBuilder from "@/components/modal/builder";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div
			className={cx(
				"flex flex-col min-h-screen",
				fontsVariables.map((fontVariable: string) => fontVariable),
				"font-sans",
			)}
		>
			<header>
				<nav></nav>
			</header>
			<main className="flex-1">{children}</main>
			<footer></footer>
			<ModalBuilder />
		</div>
	);
};

export default Layout;
