import ModalContainer from "@/components/modal/container";
import { modals } from "@/utils/config";

const ModalBuilder = () => {
	return modals.map(({ Modal, ...props }) => {
		return (
			<ModalContainer key={props.id} {...props}>
				<Modal key={props.id} {...props} />
			</ModalContainer>
		);
	});
};

export default ModalBuilder;
