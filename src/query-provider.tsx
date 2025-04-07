"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./lib/web3/config";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

const QueryWrapper = ({ children }: PropsWithChildren) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
};

export default QueryWrapper;
