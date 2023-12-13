import { AppPropsWithLayout } from "@/types/common";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import "@/styles/global.css";

function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	return (
		<SessionProvider session={session}>
			{getLayout(<Component {...pageProps} />)}
		</SessionProvider>
	);
}

export default trpc.withTRPC(MyApp);
