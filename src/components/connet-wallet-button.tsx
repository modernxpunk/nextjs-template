"use client";

import { useAccount, useConnect } from "wagmi";

const ConnectWalletButton = () => {
	const { address, isConnected } = useAccount();
	const { connectors, connect } = useConnect();

	if (isConnected) {
		return <button className="btn btn-primary">{address}</button>;
	}

	const connector = connectors[0];

	return (
		<button onClick={() => connect({ connector })} className="btn btn-primary">
			{connector.name}
		</button>
	);
};

export default ConnectWalletButton;
