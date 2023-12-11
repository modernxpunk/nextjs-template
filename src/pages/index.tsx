import Layout from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { NextPageWithLayout } from "@/types/common";

const Home: NextPageWithLayout = () => {
	return (
		<div className="container">
			<Button>asdf</Button>
			<Button intent="secondary">asdf</Button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
