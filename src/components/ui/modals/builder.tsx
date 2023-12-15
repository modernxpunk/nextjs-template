import { Suspense, useContext } from "react";
import Portal from "@/components/ui/modals/portal";
import { ModalContext } from "@/pages/_app";

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

export default ModalBuilder;
