import { AppPropsWithLayout } from "@/types/common";
import { trpc } from "@/utils/trpc";
import "@/styles/global.css";
import ModalBuilder, {
	ModalContext,
	initialStateModal,
	reducer,
} from "@/components/ui/modals/builder";
import { useReducer } from "react";
import { fontsVariables } from "@/utils/font";

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	const modalsReducer = useReducer(reducer, initialStateModal);

	return (
		<ModalContext.Provider value={modalsReducer}>
			<div
				className={`${fontsVariables.join(",").replaceAll(",", " ")} font-sans`}
			>
				{getLayout(<Component {...pageProps} />)}
			</div>
			<ModalBuilder />
		</ModalContext.Provider>
	);
}

export default trpc.withTRPC(MyApp);
