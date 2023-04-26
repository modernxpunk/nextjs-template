import React from "react";
import Layout from "src/components/common/Layout";
import "src/styles/globals.css";

export const metadata = {
	title: "Home",
	description: "Welcome to Next.js",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactElement;
}) {
	return (
		<html lang="en">
			<body>
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
