import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<button className="btn">hello</button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
