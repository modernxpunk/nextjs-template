"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ConnectWalletButton = () => {
	const t = useTranslations();

	const { address, isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();

	if (isConnected) {
		return (
			<div className="flex gap-2 items-center">
				<Button>{address}</Button>
				<Button onClick={() => disconnect()}>{t("home.disconnect")}</Button>
			</div>
		);
	}

	const connector = connectors[0];

	return (
		<Button onClick={() => connect({ connector })}>
			{t("home.connectWallet")}
		</Button>
	);
};

export default ConnectWalletButton;
