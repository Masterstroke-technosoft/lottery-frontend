"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWalletProtection } from "@/providers/WalletProtectionProvider";
import { useWriteContract, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "@/config/contract";

const recentEntries = [
    {
        wallet: "0x91c4…8ab2",
        tickets: 5,
        code: "MOONBOY",
        time: "2m ago",
    },
    {
        wallet: "0x4f7e…11d0",
        tickets: 1,
        code: "—",
        time: "4m ago",
    },
    {
        wallet: "0xbb02…59f1",
        tickets: 12,
        code: "SIXPACK",
        time: "6m ago",
    },
    {
        wallet: "0x2d18…c73a",
        tickets: 2,
        code: "LUCKY7",
        time: "9m ago",
    },
];

const draws = [
    {
        id: 1,
        title: "Lucky One",
        jackpot: "$100",
        entries: 100,
        closes: "10 mins",
        color: "#C9F24A",
    },
    {
        id: 2,
        title: "Lucky Two",
        jackpot: "$500",
        entries: 500,
        closes: "50 mins",
        color: "#FF5DB1",
    },
    {
        id: 3,
        title: "Lucky Three",
        jackpot: "$1,000",
        entries: 1000,
        closes: "2 hrs",
        color: "#67E8F9",
    },
    {
        id: 4,
        title: "Lucky Four",
        jackpot: "$2,000",
        entries: 2000,
        closes: "4 hrs",
        color: "#FACC15",
    },
    {
        id: 5,
        title: "Lucky Five",
        jackpot: "$5,000",
        entries: 5000,
        closes: "6 hrs",
        color: "#A78BFA",
    },
    {
        id: 6,
        title: "Lucky Six",
        jackpot: "$10,000",
        entries: 10000,
        closes: "24 hrs",
        color: "#FB923C",
    },
];



export default function Jackpot() {
    const searchParams = useSearchParams();
    const poolIdParam = searchParams.get("id");
    const poolId = poolIdParam ? parseInt(poolIdParam, 10) : 6;
    const currentDraw = draws.find((d) => d.id === poolId) || draws[5];

    const { data: poolInfo, refetch: refetchPoolInfo } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getCurrentPoolInfo",
        args: [BigInt(poolId - 1)],
    });

    const liveEntries = poolInfo ? Number(poolInfo[1]) : currentDraw.entries;
    const livePlayers = poolInfo ? Number(poolInfo[2]) : Math.round(currentDraw.entries * 0.7);

    const jackpotDisplay = poolInfo
        ? `$${Number(formatEther(poolInfo[6]))}`
        : currentDraw.jackpot;

    const currentPrizePoolVal = poolInfo ? poolInfo[7] : 0n;
    const currentPrizePoolDisplay = poolInfo
        ? `$${Number(formatEther(currentPrizePoolVal))}`
        : "$0";

    const [quantity, setQuantity] = useState(3);
    const [referralCode, setReferralCode] = useState("");
    const router = useRouter();
    const { checkConnection } = useWalletProtection();
    const { writeContractAsync } = useWriteContract();

    const ticketPrice = 1;
    const networkFee = 0.005;

    const subtotal = quantity * ticketPrice;
    const total = subtotal + networkFee;

    const handleRegisterReferral = async () => {
        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "registerReferral",
                args: [referralCode.trim().toUpperCase()],
                chainId: mstTestnet.id,
            });
            setTimeout(() => {
                refetchPoolInfo();
            }, 2000);
        } catch (err) {
            console.warn("Referral registration request was rejected or failed:", err);
        }
    };

    const handleEnterDraw = async () => {
        const entryFeeWei = BigInt(10 ** 18); // 1 ether in Wei
        const networkFeeWei = BigInt(5 * 10 ** 15); // 0.005 ether in Wei
        const totalValue = (entryFeeWei * BigInt(quantity)) + networkFeeWei;

        try {
            await writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "enterDraw",
                args: [
                    currentDraw.id - 1,
                    BigInt(quantity),
                    referralCode.trim().toUpperCase(),
                ],
                value: totalValue,
                chainId: mstTestnet.id,
            });
            setTimeout(() => {
                refetchPoolInfo();
            }, 2000);
        } catch (err) {
            console.warn("Draw entry transaction request was rejected or failed:", err);
        }
    };
    console.log({ poolId });
    console.log(handleEnterDraw);

    return (


        <section className="rounded-[18px] border border-white/[0.07] overflow-hidden bg-[#17121F]">

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">

                {/* LEFT */}

                <div className="border-b lg:border-b-0 lg:border-r border-white/[0.07] p-6 sm:p-10">

                    <span
                        className="font-mono text-[11px] font-semibold tracking-[0.16em]"
                        style={{ color: currentDraw.color }}
                    >
                        ★ {currentDraw.title.toUpperCase()} DRAW · SET #418
                    </span>

                    <div className="my-3 flex flex-wrap items-baseline gap-2 sm:gap-4">

                        <span
                            className="font-['Bricolage_Grotesque'] text-[56px] sm:text-[88px] font-black leading-[0.9] tracking-[-0.04em]"
                            style={{ color: currentDraw.color }}
                        >
                            {jackpotDisplay}
                        </span>

                        <span className="mb-[6px] sm:mb-[14px] text-[14px] sm:text-[15px] text-white/50">
                            winner takes all
                        </span>

                    </div>

                    {/* Live Pool Information Sub-panel */}
                    <div className="mb-6 border border-white/10 rounded-2xl bg-white/5 p-5 max-w-[560px]">
                        <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#C9F24A] font-bold mb-4">
                            Live Pool Information
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-white/40 mb-1">Prize Pool</p>
                                <p className="text-xl font-bold text-white">{jackpotDisplay}</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/40 mb-1">Current Prize Pool</p>
                                <p className="text-xl font-bold text-white">{currentPrizePoolDisplay}</p>
                                <p className="text-[10px] text-white/30 mt-0.5">(80% of collected amount)</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/40 mb-1">Participants</p>
                                <p className="text-xl font-bold text-white">{liveEntries}</p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-8 max-w-[560px] text-[14px] sm:text-[15px] leading-7 text-white/60">
                        One ticket, one entry, one winner drawn the moment the clock
                        hits zero. Prize is paid straight to the winning wallet —
                        no claim window, no forms.
                    </p>

                    {/* Stats */}

                    <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07]">

                        <div className="bg-[#1C1626] px-[18px] py-4">

                            <p className="mb-2 font-mono text-[10.5px] tracking-[0.12em] text-white/40">
                                TICKETS IN
                            </p>

                            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-semibold text-white">
                                {liveEntries}
                            </h3>

                        </div>

                        <div className="bg-[#1C1626] px-[18px] py-4">

                            <p className="mb-2 font-mono text-[10.5px] tracking-[0.12em] text-white/40">
                                PLAYERS
                            </p>

                            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-semibold text-white">
                                {livePlayers}
                            </h3>

                        </div>

                        <div className="bg-[#1C1626] px-[18px] py-4">

                            <p className="mb-2 font-mono text-[10.5px] tracking-[0.12em] text-white/40">
                                YOUR ODDS
                            </p>

                            <h3 className="font-['Bricolage_Grotesque'] text-[20px] font-semibold text-[#C9F24A]">
                                1 in {liveEntries > 0 ? liveEntries : 1}
                            </h3>

                        </div>

                        <div className="bg-[#1C1626] px-[18px] py-4">

                            <p className="mb-2 font-mono text-[10.5px] tracking-[0.12em] text-white/40">
                                DRAWN BY
                            </p>

                            <p className="pt-[5px] text-[13px] text-white/80">
                                On-chain VRF ·{" "}
                                <a
                                    href="#02"
                                    style={{ color: currentDraw.color }}
                                >
                                    proof
                                </a>
                            </p>

                        </div>

                    </div>

                    <h3 className="mb-4 font-['Bricolage_Grotesque'] text-[16px] font-extrabold text-white">
                        Recent entries
                    </h3>
                    {/* Recent Entries Table */}

                    <div className="overflow-hidden rounded-[10px] bg-white/[0.06]">

                        {/* Header */}

                        <div className="grid grid-cols-[1.4fr_1fr_1fr_.8fr] bg-[#1C1626] px-3 sm:px-4 py-[11px] font-mono text-[9.5px] sm:text-[10.5px] tracking-[0.1em] text-white/40">

                            <span>WALLET</span>

                            <span>TICKETS</span>

                            <span>VIA CODE</span>

                            <span className="text-right">
                                TIME
                            </span>

                        </div>

                        {/* Rows */}

                        {recentEntries.map((entry) => (

                            <div
                                key={entry.wallet}
                                className="grid grid-cols-[1.4fr_1fr_1fr_.8fr] border-t border-white/[0.05] bg-[#1C1626] px-3 sm:px-4 py-[13px] font-mono text-[12px] sm:text-[13px] text-white/75"
                            >

                                <span>
                                    {entry.wallet}
                                </span>

                                <span>
                                    {entry.tickets}
                                </span>

                                <span
                                    className={
                                        entry.code === "—"
                                            ? "text-white/30"
                                            : "text-[#FF5DB1]"
                                    }
                                >
                                    {entry.code}
                                </span>

                                <span className="text-right text-white/40">
                                    {entry.time}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                {/* RIGHT PANEL */}

                <div className="bg-[#1C1626] p-6 sm:p-10 lg:p-[40px_32px] flex items-center justify-center border-t lg:border-t-0 border-white/[0.07]">

                    <div className="w-full max-w-md lg:max-w-none">

                        <div className="flex flex-col gap-[22px] bg-[#1C1626]">

                            {/* Header */}

                            <div className="flex items-baseline justify-between">

                                <h3 className="font-['Bricolage_Grotesque'] text-[18px] font-extrabold text-white">
                                    Buy tickets
                                </h3>

                                <span className="font-mono text-[12px] text-white/45">
                                    2 USDC each
                                </span>

                            </div>

                            {/* Quantity */}

                            <div className="flex flex-col gap-[10px]">

                                <span className="font-mono text-[11px] tracking-[0.12em] text-white/45">
                                    QUANTITY
                                </span>

                                <div className="flex items-center gap-3">

                                    {/* Minus */}

                                    <button
                                        onClick={() =>
                                            setQuantity((prev) => Math.max(1, prev - 1))
                                        }
                                        className="h-11 w-11 rounded-[11px] border border-white/10 bg-white/5 text-[22px] text-white transition hover:bg-white/10"
                                    >
                                        −
                                    </button>

                                    {/* Value */}

                                    <div className="grid h-11 flex-1 place-items-center rounded-[11px] border border-white/10 bg-[#17121F] font-mono text-[20px] font-semibold text-white">

                                        {quantity}

                                    </div>

                                    {/* Plus */}

                                    <button
                                        onClick={() =>
                                            setQuantity((prev) => prev + 1)
                                        }
                                        className="h-11 w-11 rounded-[11px] border border-[#C9F24A]/40 bg-[#C9F24A]/10 text-[22px] text-[#C9F24A] transition hover:bg-[#C9F24A]/20"
                                    >
                                        +
                                    </button>

                                </div>

                                {/* Quick Buttons */}

                                <div className="flex gap-2">

                                    {[1, 5, 10, 25].map((num) => (

                                        <button
                                            key={num}
                                            onClick={() => setQuantity(num)}
                                            className={`flex-1 rounded-lg py-2 font-mono text-[12px] transition ${quantity === num
                                                ? "bg-[#C9F24A] text-[#17121F]"
                                                : "bg-white/5 text-white/60 hover:bg-white/10"
                                                }`}
                                        >
                                            {num}
                                        </button>

                                    ))}

                                </div>

                            </div>

                            {/* Referral */}

                            <div className="flex flex-col gap-[10px]">

                                <span className="font-mono text-[11px] tracking-[0.12em] text-white/45">

                                    REFERRAL CODE

                                    <span className="text-white/30">
                                        {" "}
                                        (OPTIONAL)
                                    </span>

                                </span>

                                <div className="flex h-[46px] items-center gap-[10px] rounded-[11px] border border-[#FF5DB1]/50 bg-[#17121F] px-[14px]">
                                    <input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                        placeholder="Enter referral code"
                                        className="flex-1 bg-transparent font-mono text-[14px] font-semibold tracking-[0.08em] text-white placeholder:text-gray-500 outline-none"
                                    />

                                    <span className="rounded-md bg-[#FF5DB1]/20 px-2 py-1 font-mono text-[11px] font-semibold text-[#FF5DB1]">
                                        Apply
                                    </span>
                                </div>

                                <p className="text-[12px] leading-6 text-white/45">

                                    Credits{" "}

                                    <strong className="text-[#FF5DB1]">

                                        @moonboy

                                    </strong>

                                    {" "}for this entry. Costs you nothing.

                                </p>

                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Price */}

                            <div className="space-y-[9px]">

                                <div className="flex justify-between text-[13.5px] text-white/60">

                                    <span>

                                        {quantity} tickets × 1 USDC

                                    </span>

                                    <span className="font-mono text-white">

                                        {subtotal.toFixed(1)}

                                    </span>

                                </div>

                                <div className="flex justify-between text-[13.5px] text-white/60">

                                    <span>

                                        Network fee

                                    </span>

                                    <span className="font-mono text-white">

                                        {networkFee.toFixed(3)}

                                    </span>

                                </div>

                                <div className="flex items-baseline justify-between border-t border-white/10 pt-3">

                                    <span className="font-semibold text-white">

                                        Total

                                    </span>

                                    <span className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold text-white">

                                        {total.toFixed(2)} USDC

                                    </span>

                                </div>

                            </div>

                            <button
                                onClick={() => {
                                    checkConnection(() => {
                                        handleEnterDraw();
                                        // router.push("/ticket");
                                    }, "Please connect your wallet before purchasing a lottery ticket.");
                                }}
                                style={{ backgroundColor: currentDraw.color }}
                                className="rounded-xl py-4 font-bold text-[#241A06] transition opacity-90 hover:opacity-100">

                                Enter the {jackpotDisplay} draw

                            </button>

                            <div className="text-center font-mono text-[11px] text-white/35">

                                New odds after purchase: 1 in {Math.round((liveEntries + quantity) / (quantity || 1))}

                            </div>

                            {/* Bottom Card */}

                            <div className="mt-auto rounded-[11px] border border-[#C9F24A]/20 bg-[#C9F24A]/10 p-[14px]">

                                <h4 className="mb-[5px] font-semibold text-[#C9F24A]">

                                    You're already in 4 of 6 draws

                                </h4>

                                <p className="text-[12px] leading-6 text-white/50">

                                    Add the last two for 4 USDC and cover the whole set.

                                </p>

                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </section>

    );
}