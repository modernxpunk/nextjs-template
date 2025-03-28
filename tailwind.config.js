/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	content: {
		files: [
			"./src/**/*.{js,ts,jsx,tsx,mdx}",
			"./stories/**/*.{js,ts,jsx,tsx,mdx}",
		],
	},
	theme: {
		spacing: {
			px: "1px",
			0: "0px",
			0.5: "0.125rem",
			1: "0.25rem",
			1.5: "0.375rem",
			2: "0.5rem",
			2.5: "0.625rem",
			3: "0.75rem",
			3.5: "0.875rem",
			4: "1rem",
			5: "1.25rem",
			6: "1.5rem",
			7: "1.75rem",
			8: "2rem",
			9: "2.25rem",
			10: "2.5rem",
			11: "2.75rem",
			12: "3rem",
			14: "3.5rem",
			16: "4rem",
			20: "5rem",
			24: "6rem",
			28: "7rem",
			32: "8rem",
			36: "9rem",
			40: "10rem",
			44: "11rem",
			48: "12rem",
			52: "13rem",
			56: "14rem",
			60: "15rem",
			64: "16rem",
			72: "18rem",
			80: "20rem",
			96: "24rem",
		},
		fontSize: {
			xs: ["0.75rem", { lineHeight: "1rem" }],
			sm: ["0.875rem", { lineHeight: "1.25rem" }],
			base: ["1rem", { lineHeight: "1.5rem" }],
			lg: ["1.125rem", { lineHeight: "1.75rem" }],
			xl: ["1.25rem", { lineHeight: "1.75rem" }],
			"2xl": ["1.5rem", { lineHeight: "2rem" }],
			"3xl": ["1.875rem", { lineHeight: "2.25rem" }],
			"4xl": ["2.25rem", { lineHeight: "2.5rem" }],
		},
		fontWeight: {
			thin: "100",
			extralight: "200",
			light: "300",
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
			black: "900",
		},
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
			},
		},
		keyframes: {
			appearence: {
				"0%": { transform: "scale(0.8)", opacity: 0 },
				"100%": { transform: "scale(1)", opacity: 1 },
			},
		},
		animation: {
			appear: "appearence 0.2s linear",
		},
		fontFamily: {
			sans: ["var(--font-roboto)", ...fontFamily.sans],
			title: ["var(--font-montserrat)", ...fontFamily.serif],
		},
	},
	variants: {
		extend: {},
	},
	daisyui: {
		themes: [
			{
				light: {
					primary: "#570df8",
					"primary-focus": "#4506cb",
					"primary-content": "#ffffff",

					secondary: "#f000b8",
					"secondary-focus": "#bd0091",
					"secondary-content": "#ffffff",

					accent: "#37cdbe",
					"accent-focus": "#2ba69a",
					"accent-content": "#ffffff",

					neutral: "#3b424e",
					"neutral-focus": "#2a2e37",
					"neutral-content": "#ffffff",

					"base-100": "#ffffff",
					"base-200": "#f9fafb",
					"base-300": "#ced3d9",
					"base-content": "#1e2734",

					info: "#1c92f2",
					success: "#009485",
					warning: "#ff9900",
					error: "#ff5724",

					"--rounded-box": "1rem",
					"--rounded-btn": ".5rem",
					"--rounded-badge": "1.9rem",

					"--animation-btn": ".25s",
					"--animation-input": ".2s",

					"--btn-text-case": "uppercase",
					"--navbar-padding": ".5rem",
					"--border-btn": "1px",
				},
			},
			{
				dark: {
					primary: "#ffb3d9",
					"primary-focus": "#ff80bf",
					"primary-content": "#1b1c22",

					secondary: "#b9ffb3",
					"secondary-focus": "#8aff80",
					"secondary-content": "#1b1c22",

					accent: "#ffffb3",
					"accent-focus": "#ffff80",
					"accent-content": "#1b1c22",

					neutral: "#22212c",
					"neutral-focus": "#1b1c22",
					"neutral-content": "#d5ccff",

					"base-100": "#302f3d",
					"base-200": "#22212c",
					"base-300": "#1b1c22",
					"base-content": "#d5ccff",

					info: "#1c92f2",
					success: "#009485",
					warning: "#ff9900",
					error: "#ff5724",

					"--rounded-box": "1rem",
					"--rounded-btn": ".5rem",
					"--rounded-badge": "1.9rem",

					"--animation-btn": ".25s",
					"--animation-input": ".2s",

					"--btn-text-case": "uppercase",
					"--navbar-padding": ".5rem",
					"--border-btn": "1px",
				},
			},
		],
	},
	plugins: [require("daisyui")],
};
