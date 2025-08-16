import "@/lib/api/orpc.server";
import { client } from "@/lib/api/orpc";

const Page = async () => {
	const d = await client.users.list();
	console.log(d);
	return <div className="container"></div>;
};

export default Page;
