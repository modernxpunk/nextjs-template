import { cx } from "class-variance-authority";
import React from "react";
import Layout from "src/components/common/Layout";
import "src/styles/globals.css";
import { fontsVariables } from "src/utils/config";

export default function RootLayout({
	children,
}: {
	children: React.ReactElement;
}) {
	return (
		<html
			lang="en"
			className={cx(fontsVariables.map((fontVariable: string) => fontVariable))}
		>
			<body>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
