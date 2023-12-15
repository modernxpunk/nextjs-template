import { ModalContext } from "@/pages/_app";
import { ReactElement, useContext, useEffect } from "react";

type Props = {
	id: "1" | "2";
	children?: ReactElement;
};

const ModalContainer = ({ id, children }: Props) => {
	const [state, dispatch] = useContext(ModalContext);
	// @ts-ignore
	const isOpen = state.find((modal) => modal.id === id).isOpen;

	useEffect(() => {
		// @ts-ignore
		document.getElementById(id).showModal();
	}, []);

	if (isOpen)
		return (
			<dialog id={id} className="modal">
				<div className="modal-box">{children}</div>
				<form method="dialog" className="modal-backdrop">
					<button
						onClick={() => {
							dispatch({ type: "TOGGLE_BY_ID", payload: id });
						}}
					>
						close
					</button>
				</form>
			</dialog>
		);
};

export default ModalContainer;
