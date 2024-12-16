import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonStyles = cva("btn", {
	variants: {
		intent: {
			primary: "btn-primary",
			secondary: "btn-secondary",
		},
		size: {
			sm: "btn-sm",
			md: "btn-md",
			lg: "btn-lg",
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
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonStyles> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, intent, size, ...props }, ref) => (
		<button
			className={cn(buttonStyles({ intent, size, className }))}
			ref={ref}
			{...props}
		/>
	),
);

Button.displayName = "Button";
