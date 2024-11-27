import { Roboto } from "next/font/google";

const inter = Roboto({
	subsets: ["latin"],
	variable: "--font-inter",
	weight: ["300", "400", "500", "700", "900"],
});

export const fontsVariables = [inter.variable];
