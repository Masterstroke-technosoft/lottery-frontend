"use client";

import { useAccount } from "wagmi";

export default function WalletStatus() {

    const { address, isConnected } = useAccount();

    if (!isConnected) {
        return null;
    }

    return (
        <div>

            Connected

            <br />

            {address}

        </div>
    );
}