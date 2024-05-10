"use client";

import { trpcClient } from "@/app/trpc/client";
import Icon from "@/components/icon";
import { FormEvent, KeyboardEvent, useState } from "react";

const CRUD = () => {
	const utils = trpcClient.useContext();

	const { data: posts } = trpcClient.post.getAll.useQuery();
	const { mutateAsync: createPost } = trpcClient.post.create.useMutation({
		onSuccess: () => {
			utils.post.getAll.invalidate();
		},
	});

	const { mutateAsync: deletePostById } =
		trpcClient.post.deleteById.useMutation({
			onSuccess: () => {
				utils.post.getAll.invalidate();
			},
		});

	const { data } = trpcClient.post.x.useQuery();

	const { mutateAsync: updatePostById } =
		trpcClient.post.updateById.useMutation({
			onSuccess: () => {
				utils.post.getAll.invalidate();
			},
		});

	const createPostForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = (e.target as HTMLFormElement).elements;
		// @ts-ignore
		const title = formData.title.value;
		await createPost({ title });
	};

	const deletePost = async (id: string) => {
		await deletePostById({ id });
	};

	const [isUpdating, setIsUpdating] = useState<null | string>(null);
	const updatePostSubmit = async (
		e: KeyboardEvent<HTMLInputElement>,
		id: string,
		title: string,
	) => {
		if (e.key === "Enter") {
			await updatePostById({ id, updatedPost: { title } });
			setIsUpdating(null);
		} else if (e.key === "Escape") {
			setIsUpdating(null);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<p className="text-2xl">CRUD trpc</p>
			<form onSubmit={createPostForm}>
				<input name="title" className="input input-bordered" />
			</form>
			<div className="flex flex-wrap gap-2">
				{posts?.map((post) => {
					return (
						<button
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-content"
							key={post.id}
						>
							{isUpdating === post.id ? (
								<input
									autoFocus
									className="text-black input input-bordered input-ghost input-sm w-fit"
									onBlur={() => setIsUpdating(null)}
									onKeyDown={(e) =>
										updatePostSubmit(e, post.id, e.currentTarget.value)
									}
									defaultValue={post.title}
								/>
							) : (
								post.title
							)}
							<div className="flex">
								<button className="flex-none text-lg btn btn-sm btn-circle btn-ghost">
									<Icon
										onClick={() => setIsUpdating(post.id)}
										name={`common/${isUpdating === null ? "pencil" : "close"}`}
									/>
								</button>
								{isUpdating === null && (
									<button className="flex-none text-lg btn btn-sm btn-circle btn-ghost">
										<Icon
											onClick={() => deletePost(post.id)}
											name="common/delete"
										/>
									</button>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default CRUD;
