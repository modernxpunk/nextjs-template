"use client";

import { trpcClient } from "@/app/trpc/client";

const Example = () => {
	const greetengs = trpcClient.greetings.useQuery(undefined);
	console.log("greetengs", greetengs.data);
	return (
		<div>
			<p className="text-2xl">Modals</p>
			<div className="flex gap-2">
				<button
					className="btn btn-primary"
					onClick={() => {
						const element = document.getElementById(
							"add_cat",
						) as HTMLDialogElement;
						if (element) {
							element.showModal();
						}
					}}
				>
					add cat
				</button>
				<button
					className="btn btn-primary"
					onClick={() => {
						const element = document.getElementById(
							"example",
						) as HTMLDialogElement;
						if (element) {
							element.showModal();
						}
					}}
				>
					example
				</button>
			</div>
		</div>
	);
};

export default Example;
