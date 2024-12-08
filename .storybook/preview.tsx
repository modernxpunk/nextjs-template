import React from "react";
import type { Preview } from "@storybook/react";
import "/src/globals.css";
import { cn } from "../src/lib/utils";
import { fontsVariables } from "../src/lib/font";
import defaultMessages from '../messages/en.json';
import { NextIntlClientProvider } from 'next-intl';
import nextIntl from "./next-intl";

const preview: Preview = {
	initialGlobals: {
		locale: 'en',
		locales: {
			en: 'English',
			uk: 'Ukraine',
		},
	},
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextIntl,
	},
	decorators: [
		(Story) => (
			<NextIntlClientProvider
				locale="en"
				messages={defaultMessages}
			>
				<div className={cn(fontsVariables, "font-sans")}>
					<Story />
				</div>
			</NextIntlClientProvider>
		),
	],
};

export default preview;
