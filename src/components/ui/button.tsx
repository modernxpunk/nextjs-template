import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { forwardRef, useEffect, useState } from "react";
import useSystemTheme from "use-system-theme";

// mt-4 mx-2 sm:mx-0  sm:max-w-[360px]

const buttonStyles = cva(
	"text-[16px] relative overflow-hidden font-light bg-transparent text-primary h-[50px] rounded-[10px] w-full hover:bg-primary hover:bg-opacity-10",
	{
		variants: {},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonStyles> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, ...props }, ref) => {
		const theme = useSystemTheme();

		const [coords, setCoords] = useState({ x: -1, y: -1 });
		const [isRippling, setIsRippling] = useState(false);

		useEffect(() => {
			if (coords.x !== -1 && coords.y !== -1) {
				setIsRippling(true);
				setTimeout(() => setIsRippling(false), 300);
			} else {
				setIsRippling(false);
			}
		}, [coords]);

		useEffect(() => {
			if (!isRippling) setCoords({ x: -1, y: -1 });
		}, [isRippling]);

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			const rect = e.currentTarget.getBoundingClientRect();
			setCoords({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			if (props?.onClick) {
				// @ts-ignore
				props.onClick?.();
			}
		};

		return (
			<button
				onClick={handleClick}
				className={cn(buttonStyles({ className }))}
				ref={ref}
				{...props}
			>
				{props.children}
				{isRippling && (
					<span
						className={cn(
							"absolute rounded-full animate-ripple pointer-events-none bg-white",
							theme === "dark" ? "bg-opacity-[8%]" : "bg-opacity-[80%]",
						)}
						style={{
							left: coords.x,
							top: coords.y,
							transform: "translate(-50%, -50%)",
						}}
					/>
				)}
			</button>
		);
	},
);

Button.displayName = "Button";
