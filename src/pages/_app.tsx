import { AppPropsWithLayout } from "@/types/common";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import "@/styles/global.css";
import ModalBuilder from "@/components/ui/modals/builder";
import { createContext, lazy, useReducer } from "react";
import { Montserrat, Roboto } from "next/font/google";

type State = any;
type Action = {
	type: "TOGGLE_BY_ID";
	payload: number;
};
type Modal = {
	id: "1" | "2";
	Modal: any;
	isOpen: boolean;
};

const initialState: Modal[] = [
	{
		id: "1",
		Modal: lazy(() => import("@/components/ui/modals/first")),
		isOpen: false,
	},
	{
		id: "2",
		Modal: lazy(() => import("@/components/ui/modals/second")),
		isOpen: false,
	},
];

function reducer(state: State, action: Action) {
	switch (action.type) {
		case "TOGGLE_BY_ID": {
			state = state.map((modal: any) => {
				if (action.payload === modal.id) {
					return {
						...modal,
						isOpen: modal.isOpen ? false : true,
					};
				}
				return modal;
			});
			return state;
		}
		default:
			return state;
	}
}

export const ModalContext = createContext<null | any>(null);

const roboto = Roboto({
	subsets: ["latin"],
	variable: "--font-roboto",
	weight: ["300", "500", "700"],
});

const monserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	weight: ["300", "500", "700"],
});

const fontsVariables = [roboto.variable, monserrat.variable];

function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);
	const modalsReducer = useReducer(reducer, initialState);

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
