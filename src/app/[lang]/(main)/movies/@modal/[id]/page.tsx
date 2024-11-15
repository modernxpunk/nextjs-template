import { Suspense } from "react";

const Todo = async ({ id }: { id: string }) => {
	const res = await fetch(`https://fakestoreapi.com/products/${id}`);
	const data = await res.json();
	return (
		<div>
			<h1>{data.title}</h1>
			<p>{data.price}</p>
		</div>
	);
};

const Page = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Todo id={"1"} />
		</Suspense>

		// <dialog id="my_modal_1" className="modal">
		// 	<div className="modal-box">
		// 		<h3 className="text-lg font-bold">Hello!</h3>
		// 		<p className="py-4">Press ESC key or click the button below to close</p>

		// 		<div className="modal-action">
		// 			<form method="dialog">
		// 				{/* if there is a button in form, it will close the modal */}
		// 				<button className="btn">Close</button>
		// 			</form>
		// 		</div>
		// 	</div>
		// </dialog>
	);
};

export default Page;
