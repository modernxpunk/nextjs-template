import { ReactElement, useContext, useLayoutEffect } from "react";
import { ModalContext, ModalIds } from "@/components/ui/modals/builder";
import { fontsVariables } from "@/utils/font";

type Props = {
	id: ModalIds;
	children?: ReactElement;
};

const ModalContainer = ({ id, children }: Props) => {
	const [state, dispatch] = useContext(ModalContext);
	// @ts-ignore
	const isOpen = state.find((modal) => modal.id === id).isOpen;

	useLayoutEffect(() => {
		// @ts-ignore
		document.getElementById(id).showModal();
	}, []);

	if (isOpen)
		return (
			<dialog
				id={id}
				className={`modal ${fontsVariables
					.join(",")
					.replaceAll(",", " ")} font-sans`}
			>
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
