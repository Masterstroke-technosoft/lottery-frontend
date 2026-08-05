"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWalletButton from "./connectwallet/connectwalletbutton";
import { useAccount } from "wagmi";
import { useWalletProtection } from "@/providers/WalletProtectionProvider";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Draws", href: "/lottery" },
    { name: "My Tickets", href: "/ticket" },
    { name: "Referrals", href: "/referral" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "History", href: "/history" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isConnected } = useAccount();
    const { showToast } = useWalletProtection();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 13,
        minutes: 30,
        seconds: 19,
    });

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        }
                    }
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isLeaderboardOrReferral = pathname === "/leaderboard" || pathname === "/referral";

    return (
        <header className="relative border-b border-white/[0.07] bg-[#0E0B13]/60 backdrop-blur-xl z-50">
            <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-4 sm:px-10">

                {/* Left */}

                <div className="flex items-center gap-[34px]">

                    {/* Logo */}

                    <Link
                        href="/lottery"
                        className="flex items-center gap-[10px]"
                    >
                        <div className="grid h-7 w-7 place-items-center rounded-[9px] bg-[#C9F24A] text-[13px] font-extrabold text-[#141019]">
                            6
                        </div>

                        <span className="font-['Bricolage_Grotesque'] text-[18px] font-extrabold tracking-[-0.01em] text-[#F4F0F7]">
                            LUCKY SIX
                        </span>
                    </Link>

                    {/* Navigation */}

                    <nav className="hidden lg:flex items-center gap-[26px]">

                        {navItems.map((item) => {
                            const isActive =
                                (item.href === "/lottery" && (pathname === "/lottery" || pathname === "/" || pathname?.startsWith("/jackpot"))) ||
                                (item.href !== "/lottery" && (pathname === item.href || pathname?.startsWith(item.href + "/")));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        if (item.href !== "/lottery" && !isConnected) {
                                            e.preventDefault();
                                            showToast("Please connect your wallet first to continue.");
                                        }
                                    }}
                                    className={`pb-[2px] text-[13.5px] transition-colors ${isActive
                                        ? "border-b-2 border-[#C9F24A] font-semibold text-[#F4F0F7]"
                                        : "font-normal text-[#F4F0F7]/50 hover:text-white"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}

                    </nav>

                </div>

                {/* Right */}

                <div className="flex items-center gap-[14px]">

                    {isLeaderboardOrReferral ? (
                        <div className="hidden sm:flex items-center gap-[6px] rounded-full border border-white/10 bg-[#141019] px-3.5 py-[6px]">
                            <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-white/40">
                                RANKS LOCK IN
                            </span>
                            <span className="font-mono text-[11.5px] font-extrabold text-[#C9F24A]">
                                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                            </span>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-[7px] rounded-full border border-white/10 px-3 py-[7px]">
                            <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#C9F24A]" />
                            <span className="font-mono text-[11.5px] text-white/70">
                                SET #418 LIVE
                            </span>
                        </div>
                    )}

                    <ConnectWalletButton />

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                </div>

            </div>

            {/* Mobile Drawer Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-[74px] left-0 right-0 border-b border-white/[0.07] bg-[#0E0B13]/95 backdrop-blur-2xl z-40">
                    <div className="flex flex-col p-6 gap-6">
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => {
                                const isActive =
                                    (item.href === "/lottery" && (pathname === "/lottery" || pathname === "/" || pathname?.startsWith("/jackpot"))) ||
                                    (item.href !== "/lottery" && (pathname === item.href || pathname?.startsWith(item.href + "/")));

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            if (item.href !== "/lottery" && !isConnected) {
                                                e.preventDefault();
                                                showToast("Please connect your wallet first to continue.");
                                            }
                                        }}
                                        className={`pb-[2px] text-[15px] transition-colors self-start ${isActive
                                            ? "border-b-2 border-[#C9F24A] font-semibold text-[#F4F0F7]"
                                            : "font-normal text-[#F4F0F7]/50 hover:text-white"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Status Badge */}
                        <div className="sm:hidden border-t border-white/5 pt-4">
                            {isLeaderboardOrReferral ? (
                                <div className="inline-flex items-center gap-[6px] rounded-full border border-white/10 bg-[#141019] px-3.5 py-[6px]">
                                    <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-white/40">
                                        RANKS LOCK IN
                                    </span>
                                    <span className="font-mono text-[11.5px] font-extrabold text-[#C9F24A]">
                                        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                                    </span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-[7px] rounded-full border border-white/10 px-3 py-[7px]">
                                    <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#C9F24A]" />
                                    <span className="font-mono text-[11.5px] text-white/70">
                                        SET #418 LIVE
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}