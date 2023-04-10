import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const buttonStyles = cva("rounded-full", {
	variants: {
		intent: {
			primary: "bg-slate-400",
			secondary: "bg-slate-600",
			error: "bg-red-500",
		},
		size: {
			sm: "text-sm px-2 py-1",
			md: "text-base px-4 py-2",
			lg: "text-lg px-6 py-4",
		},
		fullWidth: {
			true: "w-full",
		},
	},
	defaultVariants: {
		intent: "primary",
		size: "md",
		fullWidth: false,
	},
});

type ButtonStylesProps = VariantProps<typeof buttonStyles>;

export interface ButtonProps extends ButtonStylesProps {
	children?: ReactNode;
	onClick?: () => void;
}

const Button = ({ intent, size, fullWidth, ...props }: ButtonProps) => (
	<button className={buttonStyles({ intent, size, fullWidth })} {...props} />
);

export default Button;
