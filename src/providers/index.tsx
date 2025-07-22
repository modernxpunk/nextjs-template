import QueryWrapper from "@/providers/query-provider";
import type { PropsWithChildren } from "react";

const Providers = async ({ children }: PropsWithChildren) => {
	return <QueryWrapper>{children}</QueryWrapper>;
};

export default Providers;
