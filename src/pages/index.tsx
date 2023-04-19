import { Button } from "@ui/Button";
import { Modal } from "@ui/Modal";
import { useState } from "react";
import Layout from "src/components/common/Layout";
import { NextPageWithLayout } from "src/types/common";

const Home: NextPageWithLayout = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<div className="container">
			<Button onClick={() => setIsOpen(true)}>open modal</Button>
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				Hello world
			</Modal>
			<h3 className="text-2xl font-title font-bold">Hello world</h3>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
