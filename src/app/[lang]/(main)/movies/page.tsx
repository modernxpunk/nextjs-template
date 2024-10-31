import Link from "next/link";

const Page = () => {
	console.log("first movie page");

	return (
		<div>
			<Link scroll={false} href="/movies/1">
				first movie
			</Link>
		</div>
	);
};

export default Page;
