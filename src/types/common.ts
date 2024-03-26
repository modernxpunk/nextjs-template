import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, PropsWithChildren } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactElement<PropsWithChildren>;
};

export type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};
