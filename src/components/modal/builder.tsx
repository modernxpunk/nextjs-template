import ModalContainer from "@/components/modal/container";
import Modal1 from "@/components/modal/modal1";
import Modal2 from "@/components/modal/modal2";

const modals = [
	{ id: "add_cat", Modal: Modal1 },
	{ id: "example", Modal: Modal2 },
];

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
