import { NextPage } from "next";

const Home: NextPage = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<header>
				<nav></nav>
			</header>
			<main className="flex-1">Hello World!</main>
			<footer></footer>
		</div>
	);
};

export default Home;
