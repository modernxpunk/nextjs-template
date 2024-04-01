import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "@/types/common";
import { useRef } from "react";

const Home: NextPageWithLayout = () => {
	const refButton = useRef<HTMLButtonElement | null>(null);

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
				ref={refButton}
				full
				onClick={() =>
					(document.getElementById("2") as HTMLDialogElement)?.showModal()
				}
			>
				open modal 2
			</Button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
