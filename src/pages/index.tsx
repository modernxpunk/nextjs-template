import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/types/common";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CreateUserSchema, createUserSchema, resolver } from "@/utils/schemas";
import { useContext } from "react";
import { ModalContext } from "./_app";
import { GetServerSideProps } from "next";
import { getRedirectToSign } from "@/server/auth";

export const getServerSideProps: GetServerSideProps<{}> = getRedirectToSign;

const Home: NextPageWithLayout = () => {
	const [state, dispatch] = useContext(ModalContext);

	const utils = trpc.useUtils();

	const { data: users } = trpc.user.getAll.useQuery(undefined);

	const { mutate: createUser } = trpc.user.createUser.useMutation({
		onSuccess() {
			utils.user.getAll.invalidate();
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateUserSchema>({
		resolver: resolver(createUserSchema),
	});

	const onSubmit: SubmitHandler<CreateUserSchema> = async (data) => {
		createUser({ user: data });
		reset();
	};

	const { mutate: deleteUserById } = trpc.user.deleteById.useMutation({
		onSuccess() {
			utils.user.getAll.invalidate();
		},
	});

	return (
		<div className="container">
			<form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mt-4">
				<div className="flex-1">
					<input
						placeholder="Email"
						className="flex-1 w-full input input-bordered"
						{...register("email")}
					/>
					{errors.email && (
						<p className="text-sm text-red-400">This field is required</p>
					)}
				</div>
				<div className="flex-1">
					<input
						placeholder="Name"
						className="flex-1 w-full input input-bordered"
						{...register("name")}
					/>
					{errors.name && (
						<p className="text-sm text-red-400">This field is required</p>
					)}
				</div>
				<button className="btn" type="submit">
					Submit
				</button>
			</form>
			<div className="overflow-x-auto">
				<table className="table">
					<thead>
						<tr>
							<th></th>
							<th>Email</th>
							<th>Username</th>
							<th></th>
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
										<td>
											<button
												className="btn btn-sm btn-error"
												onClick={() =>
													deleteUserById({
														id: user.id,
													})
												}
											>
												delete
											</button>
										</td>
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
			<div className="flex gap-2">
				<button
					onClick={() => {
						dispatch({ type: "TOGGLE_BY_ID", payload: "1" });
					}}
					className="btn btn-primary"
				>
					First modal
				</button>
				<button
					onClick={() => {
						dispatch({ type: "TOGGLE_BY_ID", payload: "2" });
					}}
					className="btn btn-primary"
				>
					Second modal
				</button>
			</div>
		</div>
	);
};

Home.getLayout = (page) => {
	return <Layout>{page}</Layout>;
};

export default Home;
