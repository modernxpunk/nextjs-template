import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatAddress = (address: `0x${string}`) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
