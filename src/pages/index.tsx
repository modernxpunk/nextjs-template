import Layout from "@/components/layout";
import { appRouter } from "@/server/routes/_app";
import { NextPageWithLayout } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import superjson from "superjson";
import { signOut } from "next-auth/react";

export async function getServerSideProps(
	context: GetServerSidePropsContext<{ id: string }>,
) {
	const helpers = createServerSideHelpers({
		router: appRouter,
		// @ts-ignore
		ctx: {},
		transformer: superjson,
	});

	await helpers.user.getAll.prefetch();

	return {
		props: {
			trpcState: helpers.dehydrate(),
		},
	};
}

const Home: NextPageWithLayout = (props: any) => {
	const utils = trpc.useUtils();

	const { data: users } = trpc.user.getAll.useQuery(undefined);
	// const { data: user } = trpc.user.getById.useQuery({
	// 	id: props.id,
	// });
	const { mutate: createUser } = trpc.user.editById.useMutation({
		onSuccess() {
			utils.user.getAll.invalidate();
		},
	});
	const { mutate: editUserById } = trpc.user.editById.useMutation({
		onSuccess() {
			utils.user.getById.invalidate();
		},
	});
	const { mutate: deleteUserById } = trpc.user.deleteById.useMutation({
		onSuccess() {
			utils.user.getById.invalidate();
		},
	});

	return (
		<div className="container">
			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th></th>
							<th>Email</th>
							<th>Username</th>
						</tr>
					</thead>
					<tbody>
						{users &&
							users.map((user) => {
								return (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.email}</td>
										<td>{user.name}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			<button className="btn" onClick={() => signOut()}>
				sign out
			</button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
