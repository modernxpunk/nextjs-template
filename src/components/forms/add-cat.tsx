"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FormHTMLAttributes, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaAddCat = z.object({
	name: z.string().min(10).max(255),
	cat: z.enum(["Cat1", "Cat2", "Cat3"]),
});

export type AddCat = z.infer<typeof schemaAddCat>;

const AddCatForm = (props: FormHTMLAttributes<HTMLFormElement>) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddCat>({
		resolver: zodResolver(schemaAddCat),
	});

	const formRef = useRef<HTMLFormElement>(null);
	const closeDialog = () => formRef.current?.closest("dialog")?.close();

	const onSubmit = async (data: AddCat) => {
		try {
			console.log(data);
			closeDialog();
			reset();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form ref={formRef} onSubmit={handleSubmit(onSubmit)} {...props}>
			<label className="w-full form-control">
				<div className="label">
					<span className="label-text">Name</span>
					{errors.name && (
						<span className="label-text-alt text-error">
							{errors.name.message}
						</span>
					)}
				</div>
				<input
					disabled={isSubmitting}
					className={cn(
						"w-full input input-bordered",
						errors.name &&
							"select-error bg-error bg-opacity-5 text-error placeholder:text-error",
					)}
					{...register("name")}
					placeholder="Email address"
				/>
			</label>
			<label className="w-full form-control">
				<div className="label">
					<span className="label-text">Cats</span>
					{errors.cat && (
						<span className="label-text-alt text-error">
							{errors.cat.message}
						</span>
					)}
				</div>
				<select
					disabled={isSubmitting}
					className={cn(
						"w-full select select-bordered",
						errors.cat && "select-error bg-error bg-opacity-5 text-error",
					)}
					{...register("cat")}
				>
					<option value="Cat1">Cat1</option>
					<option value="Cat2">Cat2</option>
					<option value="Cat3">Cat3</option>
					<option value="Cat4">Cat4</option>
				</select>
			</label>

			<div className="flex justify-end mt-8">
				<div className="flex gap-2">
					<Button
						disabled={isSubmitting}
						type="button"
						onClick={closeDialog}
						className={cn("btn", isSubmitting && "btn-disabled animate-pulse")}
					>
						cancel
					</Button>
					<Button
						disabled={isSubmitting}
						className={cn(
							"btn btn-primary",
							isSubmitting && "btn-disabled animate-pulse",
						)}
						type="submit"
					>
						{isSubmitting && <div className="loading"></div>}
						add
					</Button>
				</div>
			</div>
		</form>
	);
};

export default AddCatForm;
