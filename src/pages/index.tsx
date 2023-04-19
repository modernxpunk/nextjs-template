import { Button } from "@ui/Button";
import Layout from "src/components/common/Layout";
import { NextPageWithLayout } from "src/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<Button>hello world</Button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
