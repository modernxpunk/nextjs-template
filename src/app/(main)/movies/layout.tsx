import type { PropsWithChildren, ReactNode } from "react";

const Layout = ({
	children,
	modal,
}: PropsWithChildren<{ modal: ReactNode }>) => {
	return (
		<div>
			{children}
			{modal}
		</div>
	);
};

export default Layout;
