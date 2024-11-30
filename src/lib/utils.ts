import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const count = (str: any, char: any) =>
	str.toLowerCase().split(char.toLowerCase()).length - 1;
