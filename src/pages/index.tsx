import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<button
				className="btn"
				onClick={() =>
					(document.getElementById("1") as HTMLDialogElement)?.showModal()
				}
			>
				open modal 1
			</button>
			<button
				className="btn"
				onClick={() =>
					(document.getElementById("2") as HTMLDialogElement)?.showModal()
				}
			>
				open modal 2
			</button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
