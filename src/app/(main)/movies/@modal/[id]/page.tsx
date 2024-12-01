import Link from "next/link";
import { Suspense } from "react";

const Todo = async ({ id }: { id: string }) => {
	const res = await fetch(`https://fakestoreapi.com/products/${id}`);
	const data = await res.json();
	return (
		<div className="modal-box">
			<h3 className="text-lg font-bold">Hello!</h3>
			<h1>{data.title}</h1>
			<p>{data.price}</p>
			<div className="modal-action">
				<form method="dialog">
					<Link href="/movies" className="btn">
						Close
					</Link>
				</form>
			</div>
		</div>
	);
};

const Page = () => {
	return (
		<dialog className="bg-black bg-opacity-50 modal modal-open">
			<Suspense fallback={<div>Loading...</div>}>
				<Todo id={"1"} />
			</Suspense>
			<form method="dialog" className="modal-backdrop">
				<Link href="/movies">close</Link>
			</form>
		</dialog>
	);
};

export default Page;
