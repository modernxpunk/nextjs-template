"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { trpcClient } from "@/app/trpc/client";
import { configTrpc } from "@/utils/trpc";

export default function Provider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient({}));
	const [trpc] = useState(() => trpcClient.createClient(configTrpc));

	return (
		<trpcClient.Provider client={trpc} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpcClient.Provider>
	);
}
