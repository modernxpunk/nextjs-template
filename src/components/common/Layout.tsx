import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const Layout = ({ children }: Props) => {
	return (
		<div className="flex flex-col min-h-screen">
			<header>
				<nav></nav>
			</header>
			<main className="flex-1">{children}</main>
			<footer></footer>
		</div>
	);
};

export default Layout;
