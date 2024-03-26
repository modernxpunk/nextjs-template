import ModalContainer from "./container";
import { MODALS } from "@/utils/constant";

const ModalBuilder = () => {
	return MODALS.map(({ Modal, ...props }) => {
		return (
			<ModalContainer key={props.id} {...props}>
				<Modal key={props.id} {...props} />
			</ModalContainer>
		);
	});
};

export default ModalBuilder;
