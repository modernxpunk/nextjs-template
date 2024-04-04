"use client";

import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "@/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<Button
				onClick={() =>
					(document.getElementById("1") as HTMLDialogElement)?.showModal()
				}
			>
				open modal 1
			</Button>
			<Button
				onClick={() =>
					(document.getElementById("2") as HTMLDialogElement)?.showModal()
				}
			>
				open modal 2
			</Button>
		</div>
	);
};

export default Home;
