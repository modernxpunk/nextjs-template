import React from "react";
import type { Preview } from "@storybook/react";
import "/src/globals.css";
import { cn } from "../src/lib/utils";
import { fontsVariables } from "../src/lib/font";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
			<div className={cn(fontsVariables, "font-sans")}>
				<Story />
			</div>
		),
	],
};

export default preview;
