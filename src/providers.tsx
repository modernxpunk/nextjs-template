import { ThemeProvider } from "next-themes";
import QueryWrapper from "@/query-provider";
import type { PropsWithChildren } from "react";

const Providers = async ({ children }: PropsWithChildren) => {
	return (
		<QueryWrapper>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
				themes={["light", "dark"]}
			>
				{children}
			</ThemeProvider>
		</QueryWrapper>
	);
};

export default Providers;
