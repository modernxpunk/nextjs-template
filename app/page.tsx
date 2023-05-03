import Example from "src/components/example-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
	description: "Welcome to Next.js",
};

const Home = () => {
	return (
		<div className="container">
			<Example />
		</div>
	);
};

export default Home;
