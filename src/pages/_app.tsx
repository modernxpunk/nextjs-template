import { AppPropsWithLayout } from "@/types/common";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import "@/styles/global.css";
import ModalBuilder, {
	ModalContext,
	initialStateModal,
	reducer,
} from "@/components/ui/modals/builder";
import { useReducer } from "react";
import { fontsVariables } from "@/utils/font";

function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	const modalsReducer = useReducer(reducer, initialStateModal);

	return (
		<ModalContext.Provider value={modalsReducer}>
			<SessionProvider session={session}>
				<div
					className={`${fontsVariables
						.join(",")
						.replaceAll(",", " ")} font-sans`}
				>
					{getLayout(<Component {...pageProps} />)}
				</div>
				<ModalBuilder />
			</SessionProvider>
		</ModalContext.Provider>
	);
}

export default trpc.withTRPC(MyApp);
