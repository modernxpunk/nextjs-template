import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes } from "react";

const inputStyles = cva("input", {
	variants: {
		intent: {
			primary: "input-primary",
			secondary: "input-secondary",
		},
		size: {
			sm: "input-sm",
			md: "input-md",
			lg: "input-lg",
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

export interface InputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputStyles> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, intent, size, placeholder, value, ...props }, ref) => {
		return (
			<label className="relative inline-block">
				<input
					className={cn(inputStyles({ intent, size, className }), "peer")}
					placeholder=" "
					ref={ref}
					{...props}
				/>
				<span className="absolute px-1 transition-all select-none peer-v top-3 left-2 bg-base-100 peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-sm">
					{placeholder}
				</span>
			</label>
		);
	},
);

Input.displayName = "Input";
