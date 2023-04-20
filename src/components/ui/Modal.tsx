import React, { MouseEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const modal = cva(
	"flex justify-center items-center fixed inset-0 bg-[rgba(0,0,0,0.6)]",
	{
		variants: {},
		compoundVariants: [],
		defaultVariants: {},
	}
);

const modal_body = cva("px-4 py-2 animate-appear", {
	variants: {
		intent: {
			primary: "bg-white",
		},
	},
	compoundVariants: [],
	defaultVariants: {
		intent: "primary",
	},
});

export interface ModalProps
	extends React.ButtonHTMLAttributes<HTMLDivElement>,
		VariantProps<typeof modal> {
	isOpen?: boolean;
	onClose: MouseEventHandler;
}

export const Modal: React.FC<ModalProps> = ({
	children,
	isOpen = false,
	onClose,
	...props
}) => {
	if (!isOpen) {
		return null;
	}
	return (
		<div className={modal()} onClick={onClose} {...props}>
			<div className={modal_body()} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
};
