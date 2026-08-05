"use client";

import { useConnect } from "wagmi";

interface Props {
    onClose: () => void;
}

export default function BrowserWalletCard({ onClose }: Props) {
    const { connectors, connectAsync } = useConnect();

    const injected = connectors.find(
        (connector) => connector.id === "injected"
    );

    const walletDetected = !!injected;

    const handleConnect = async () => {
        if (!injected) return;

        try {
            await connectAsync({
                connector: injected,
            });

            // Close modal after successful connection
            onClose();
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };

    return (
        <button
            onClick={handleConnect}
            className="w-full rounded-2xl border border-zinc-700 p-6 text-left"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Browser Wallet
                    </h2>

                    <p className="text-zinc-400">
                        {walletDetected
                            ? "Wallet Detected"
                            : "No Wallet Installed"}
                    </p>
                </div>

                <div>
                    {walletDetected ? (
                        <span className="rounded-full bg-green-600 px-4 py-2 text-sm">
                            READY
                        </span>
                    ) : (
                        <span className="rounded-full bg-red-600 px-4 py-2 text-sm">
                            INSTALL
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}