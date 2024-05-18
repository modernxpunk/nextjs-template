"use client";

import { trpcClient } from "@/app/trpc/client";
import Icon from "@/components/icon";
import { FormEvent, KeyboardEvent, useState } from "react";

const CRUD = () => {
	const utils = trpcClient.useContext();

	const [page, setPage] = useState(1);
	const {
		data,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
		hasPreviousPage,
	} = trpcClient.post.getAll.useInfiniteQuery(
		{ page },
		{
			getNextPageParam: (lastPage) => lastPage.nextPage ?? null,
			getPreviousPageParam: (firstPage) => firstPage.previousPage ?? null,
			refetchOnWindowFocus: false,
			retry: 0,
		},
	);

	const posts = data?.pages[0]?.posts || [];

	const handlePrevPage = async () => {
		await fetchPreviousPage();
		setPage(page - 1);
	};
	const handleNextPage = async () => {
		await fetchNextPage();
		setPage(page + 1);
	};

	const { mutateAsync: createPost } = trpcClient.post.create.useMutation({
		onSuccess: () => {
			utils.post.getAll.invalidate();
		},
	});

	const { mutateAsync: deletePostById } = trpcClient.post.delete.useMutation({
		onSuccess: () => {
			utils.post.getAll.invalidate();
		},
	});

	const { mutateAsync: updatePostById } = trpcClient.post.update.useMutation({
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

	const deletePost = async (id: number) => {
		await deletePostById({ id });
	};

	const [isUpdating, setIsUpdating] = useState<null | number>(null);
	const updatePostSubmit = async (
		e: KeyboardEvent<HTMLInputElement>,
		id: number,
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
									defaultValue={String(post.title)}
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
			<div className="flex gap-2">
				<button
					onClick={handlePrevPage}
					disabled={!hasPreviousPage}
					className="btn btn-primary"
				>
					prev page
				</button>
				<button
					onClick={handleNextPage}
					disabled={!hasNextPage}
					className="btn btn-primary"
				>
					next page
				</button>
			</div>
		</div>
	);
};

export default CRUD;
