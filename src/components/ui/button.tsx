import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const button = cva("btn", {
	variants: {
		intent: {
			primary: "btn-primary",
			secondary: "btn-secondary",
		},
		size: {
			sm: "btn-sm",
			md: "btn-md",
		},
		full: {
			true: "w-full",
		},
	},
	compoundVariants: [{ intent: "primary", size: "md", class: "uppercase" }],
	defaultVariants: {
		intent: "primary",
		size: "md",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
	className,
	intent,
	size,
	...props
}) => <button className={button({ intent, size, className })} {...props} />;
