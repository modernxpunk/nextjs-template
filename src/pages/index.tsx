import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";

const Home: NextPageWithLayout = () => {
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
			<button
				className="btn"
				onClick={() => signOut({ callbackUrl: "/sign-in" })}
			>
				sign out
			</button>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
