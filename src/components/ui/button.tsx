import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { forwardRef, useEffect, useState } from "react";
import useSystemTheme from "use-system-theme";

const buttonStyles = cva(
	"text-[16px] relative overflow-hidden font-light bg-transparent text-primary h-[50px] rounded-[10px] w-full hover:bg-primary hover:bg-opacity-10",
);

const rippleStyles = cva(
	"absolute rounded-full animate-ripple pointer-events-none bg-white",
	{
		variants: {
			theme: {
				dark: "bg-opacity-[8%]",
				light: "bg-opacity-[80%]",
			},
		},
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
			setIsRippling(coords.x !== -1 && coords.y !== -1);
			if (coords.x !== -1 && coords.y !== -1) {
				setTimeout(() => setIsRippling(false), 300);
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
				props.onClick?.(e);
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
						className={rippleStyles({ theme })}
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
