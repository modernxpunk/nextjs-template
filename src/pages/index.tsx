import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<button className="btn btn-primary">Button</button>
			<button className="btn btn-secondary">Button</button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
