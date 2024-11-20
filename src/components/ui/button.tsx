import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";
import { tw } from "typewind";

const buttonStyles = cva(tw.btn, {
	variants: {
		intent: {
			primary: tw.btn_primary,
			secondary: tw.btn_secondary,
		},
		size: {
			sm: tw.btn_sm,
			md: tw.btn_md,
			lg: tw.btn_lg,
		},
		full: {
			true: tw.w_full,
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
