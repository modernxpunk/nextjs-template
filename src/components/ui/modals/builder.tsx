import { Suspense, createContext, lazy, useContext } from "react";
import Portal from "@/components/ui/modals/portal";

type ModalState = any;
type ModalAction = {
	type: "TOGGLE_BY_ID";
	payload: number;
};
type ModalIds = "1" | "2";
type Modal = {
	id: ModalIds;
	Modal: any;
	isOpen: boolean;
};

const initialStateModal: Modal[] = [
	{
		id: "1",
		Modal: lazy(() => import("@/components/ui/modals/first")),
		isOpen: false,
	},
	{
		id: "2",
		Modal: lazy(() => import("@/components/ui/modals/second")),
		isOpen: false,
	},
];

const reducer = (state: ModalState, action: ModalAction) => {
	switch (action.type) {
		case "TOGGLE_BY_ID": {
			state = state.map((modal: any) => {
				if (action.payload === modal.id) {
					return {
						...modal,
						isOpen: modal.isOpen ? false : true,
					};
				}
				return modal;
			});
			return state;
		}
		default:
			return state;
	}
};

const ModalContext = createContext<null | any>(initialStateModal);

const ModalBuilder = () => {
	const [state] = useContext(ModalContext);

	return (
		<Portal>
			{state.map(({ Modal, id, isOpen }: any) => {
				if (isOpen) {
					return (
						<Suspense key={id}>
							<Modal />
						</Suspense>
					);
				}
			})}
		</Portal>
	);
};

export { initialStateModal, reducer, ModalContext };
export type { ModalIds, ModalState, ModalAction, Modal };

export default ModalBuilder;
