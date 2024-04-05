import type { PropsWithChildren } from "react";

type ModalWithChildren = PropsWithChildren & { id: string };

const ModalContainer = ({ id, children }: ModalWithChildren) => {
	return (
		<dialog id={id} className="modal modal-bottom sm:modal-middle">
			<div className="max-w-3xl modal-box">
				<form method="dialog">
					<button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">
						✕
					</button>
				</form>
				{children}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button />
			</form>
		</dialog>
	);
};

export default ModalContainer;
