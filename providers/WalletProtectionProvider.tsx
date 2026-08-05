"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useRouter, usePathname } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { mstTestnet } from "@/config/contract";

interface WalletProtectionContextType {
    showToast: (message: string) => void;
    checkConnection: (onConnected: () => void, customMsg?: string) => void;
}

const WalletProtectionContext = createContext<WalletProtectionContextType | undefined>(undefined);

export function useWalletProtection() {
    const context = useContext(WalletProtectionContext);
    if (!context) {
        throw new Error("useWalletProtection must be used within a WalletProtectionProvider");
    }
    return context;
}

export default function WalletProtectionProvider({ children }: { children: React.ReactNode }) {
    const { isConnected, isConnecting, isReconnecting, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const router = useRouter();
    const pathname = usePathname();

    const [toast, setToast] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const showToast = (message: string) => {
        setTimeout(() => {
            setToast(message);
            setIsLeaving(false);
        }, 0);
    };

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;

        const fadeTimer = setTimeout(() => {
            setIsLeaving(true);
        }, 3700);

        const dismissTimer = setTimeout(() => {
            setToast(null);
            setIsLeaving(false);
        }, 4000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(dismissTimer);
        };
    }, [toast]);

    // Route Protection logic
    useEffect(() => {
        if (!isMounted || isConnecting || isReconnecting) return;

        const protectedRoutes = ["/ticket", "/referral", "/leaderboard", "/history", "/jackpot"];
        const isProtected = protectedRoutes.some(route =>
            pathname === route || pathname?.startsWith(route + "/")
        );

        if (isProtected && !isConnected) {
            setTimeout(() => {
                router.replace("/lottery");
                showToast("Connect your wallet to access this page.");
            }, 0);
        }
    }, [pathname, isConnected, isMounted, isConnecting, isReconnecting, router]);

    const checkConnection = (onConnected: () => void, customMsg?: string) => {
        if (!isConnected) {
            showToast(customMsg || "Please connect your wallet first to continue.");
            return;
        }
        if (chainId !== mstTestnet.id) {
            showToast("Switching network to MST Testnet...");
            switchChainAsync({ chainId: mstTestnet.id })
                .then(() => {
                    onConnected();
                })
                .catch((err) => {
                    console.error("Failed to switch network:", err);
                    showToast("Please switch network to MST Testnet in your wallet.");
                });
            return;
        }
        onConnected();
    };

    return (
        <WalletProtectionContext.Provider value={{ showToast, checkConnection }}>
            {children}

            {/* Inject CSS keyframes for smooth toast transitions */}
            <style jsx global>{`
                @keyframes slideDown {
                    from {
                        transform: translate(-55%, -20px);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-55%, 0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                .animate-slide-down {
                    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-out {
                    animation: fadeOut 0.3s ease-out forwards;
                }
            `}</style>

            {/* Custom Premium Toast notification */}
            {toast && (
                <div
                    className={`fixed top-6 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-[#1C1626] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all ${isLeaving ? "animate-fade-out" : "animate-slide-down"
                        }`}
                    style={{ transform: "translateX(-50%)" }}
                >
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#C9F24A]/10 text-[#C9F24A]">
                        <AlertCircle size={18} />
                    </div>
                    <p className="text-[14px] font-medium text-white/90 whitespace-nowrap">
                        {toast}
                    </p>
                </div>
            )}
        </WalletProtectionContext.Provider>
    );
}
