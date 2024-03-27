import { AddCat } from "@/types/form";
import { resolver, schemaAddCat } from "@/utils/config";
import { cx } from "class-variance-authority";
import { useRef } from "react";
import { useForm } from "react-hook-form";

const AddCatForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddCat>({
		resolver: resolver(schemaAddCat),
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
		<form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
			<div className="w-full form-control">
				<label className="label">
					<span className="label-text">Name</span>
					{errors.name && (
						<span className="label-text-alt text-error">
							{errors.name.message}
						</span>
					)}
				</label>
				<input
					disabled={isSubmitting}
					className={cx(
						"w-full input input-sm input-bordered",
						errors.name && "input-error",
					)}
					{...register("name")}
				/>
			</div>
			<div className="flex justify-end mt-4">
				<div className="flex gap-2">
					<button
						disabled={isSubmitting}
						type="button"
						onClick={closeDialog}
						className={cx("btn", isSubmitting && "btn-disabled animate-pulse")}
					>
						cancel
					</button>
					<button
						disabled={isSubmitting}
						className={cx(
							"btn btn-primary",
							isSubmitting && "btn-disabled animate-pulse",
						)}
						type="submit"
					>
						{isSubmitting && <div className="loading"></div>}
						add
					</button>
				</div>
			</div>
		</form>
	);
};

export default AddCatForm;
