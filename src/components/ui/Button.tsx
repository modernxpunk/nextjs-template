import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva("rounded-lg", {
	variants: {
		intent: {
			primary: "bg-primary text-white border-transparent hover:bg-primary-600",
			secondary:
				"bg-secondary text-white boder-secondary-400 hover:bg-secondary-100",
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

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof button> {}

export const Button: React.FC<ButtonProps> = ({
	className,
	intent,
	size,
	full,
	children,
	...props
}) => (
	<button
		className={twMerge(button({ intent, size, full, className }))}
		{...props}
	>
		{children}
	</button>
);
