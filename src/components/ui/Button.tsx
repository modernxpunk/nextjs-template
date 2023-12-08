import React, { ButtonHTMLAttributes, FC } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva("rounded-lg text-white", {
	variants: {
		intent: {
			primary: "bg-primary border-transparent hover:bg-primary-600",
			secondary: "bg-secondary boder-secondary-400 hover:bg-secondary-100",
		},
		size: {
			small: "text-sm py-1 px-2",
			medium: "text-base py-2 px-4",
		},
		full: {
			true: "w-full",
		},
	},
	compoundVariants: [{ intent: "primary", size: "medium", class: "uppercase" }],
	defaultVariants: {
		intent: "primary",
		size: "medium",
		full: false,
	},
});

type ButtonStylesProps = VariantProps<typeof buttonStyles>;
export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonStylesProps {
	full?: boolean;
	intent?: NonNullable<ButtonStylesProps["intent"]>;
	size?: NonNullable<ButtonStylesProps["size"]>;
}

export const Button: FC<ButtonProps> = ({
	className,
	intent,
	size,
	full,
	children,
	...props
}) => (
	<button
		className={twMerge(buttonStyles({ intent, size, full, className }))}
		{...props}
	>
		{children}
	</button>
);
