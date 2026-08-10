"use client";

import { useAccount, useDisconnect, useConnect } from "wagmi";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
export default function ConnectWalletButton() {
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { connectors, connect } = useConnect();

    const injected = connectors.find(
        (connector) => connector.id === "injected"
    );

    useEffect(() => {
        if (!isConnected || !address) return;

        const generateReferralCode = async () => {
            try {
                const response = await fetch(
                    "/api/referral/generate",    // still we have to change here api currently its demo
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            walletAddress: address,
                        }),
                    }
                );

                const data = await response.json();

                console.log("Referral Code:", data.referralCode);
            } catch (error) {
                console.error("Failed to generate referral code:", error);
            }
        };

        generateReferralCode();
    }, [isConnected, address]);

    return (
        <>
            {isConnected ? (
                <div className="flex items-center gap-2">
                    <button
                        className="rounded-[10px] bg-[#C9F24A] px-5 py-[11px] text-[13.5px] font-semibold text-[#141019]"
                    >
                        {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    </button>

                    <button
                        onClick={() => disconnect()}
                        title="Disconnect Wallet"
                        className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] border border-[#2B2B2B] bg-[#17131F] text-[#A1A1AA] transition-all duration-200 border-[#C9F24A] hover:bg-[#1F1A29] hover:text-[#C9F24A]"
                    >
                        <LogOut size={18} strokeWidth={2} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => {
                        if (injected) {
                            connect({ connector: injected });
                        }
                    }}
                    className="rounded-[10px] bg-[#C9F24A] px-5 py-[11px] text-[13.5px] font-semibold text-[#141019] transition hover:bg-[#D9FF67]"
                >
                    Connect Wallet
                </button>
            )}
        </>
    );
}