import Link from "next/link";

const Page = () => {
	return (
		<div>
			<Link scroll={false} href="/movies/1">
				first movie
			</Link>
		</div>
	);
};

export default Page;
