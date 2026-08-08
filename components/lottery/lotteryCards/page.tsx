"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Ticket, Users, Clock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWalletProtection } from "@/providers/WalletProtectionProvider";

// const draws = [
//     {
//         id: 1,
//         title: "Lucky One",
//         jackpot: "$100",
//         entries: 100,
//         closes: "10 mins",
//         color: "#C9F24A",
//     },
//     {
//         id: 2,
//         title: "Lucky Two",
//         jackpot: "$500",
//         entries: 500,
//         closes: "50 mins",
//         color: "#FF5DB1",
//     },
//     {
//         id: 3,
//         title: "Lucky Three",
//         jackpot: "$1000",
//         entries: 1000,
//         closes: "2 hrs",
//         color: "#67E8F9",
//     },
//     {
//         id: 4,
//         title: "Lucky Four",
//         jackpot: "$2000",
//         entries: 2000,
//         closes: "4 hrs",
//         color: "#FACC15",
//     },
//     {
//         id: 5,
//         title: "Lucky Five",
//         jackpot: "$5000",
//         entries: 5000,
//         closes: "6 hrs",
//         color: "#A78BFA",
//     },
//     {
//         id: 6,
//         title: "Lucky Six",
//         jackpot: "$10000",
//         entries: 10000,
//         closes: "24 hrs",
//         color: "#FB923C",
//     },
// ];

import { useReadContract, useAccount, useReadContracts, useWriteContract, useWatchContractEvent } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS, mstTestnet } from "@/config/contract";

function formatClosesTime(seconds: bigint | number, poolNumber: number): string {
    const secs = Number(seconds);
    if (secs <= 0) return "Closed";
    const mins = Math.ceil(secs / 60);
    const hrs = Math.floor(mins / 60);

    if (poolNumber === 1 || poolNumber === 2) {
        return `${mins} mins`;
    } else {
        if (hrs > 0) {
            const remainingMins = mins % 60;
            return `${hrs} hr${hrs > 1 ? "s" : ""}${remainingMins > 0 ? ` ${remainingMins} mins` : ""}`;
        }
        return `${mins} mins`;
    }
}

export default function LotteryCards() {
    const { address } = useAccount();

    const [poolEndTimes, setPoolEndTimes] = useState<Record<number, number>>({});
    const [now, setNow] = useState(Date.now());
    const [initialFetchTime, setInitialFetchTime] = useState<number | null>(null);

    const {
        data: pools,
        isLoading,
        error,
        refetch: refetchPools,
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getAllPoolsInfo",
    });

    useEffect(() => {
        if (pools) {
            const endTimes: Record<number, number> = {};
            pools.forEach((pool) => {
                const poolId = Number(pool.poolNumber);
                endTimes[poolId] = Date.now() + Number(pool.remainingTime) * 1000;
            });
            setPoolEndTimes(endTimes);
            setInitialFetchTime(Date.now());
        }
    }, [pools]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: userTicketsData, refetch: refetchUserTickets } = useReadContracts({
        contracts: (pools?.map((pool) => ({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "userTicketCounts",
            args: [pool.currentRound, pool.drawType, address || "0x0000000000000000000000000000000000000000"],
        })) ?? []) as any,
        query: {
            enabled: !!address && !!pools && pools.length > 0,
        }
    });

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "Entered",
        onLogs() {
            refetchPools();
            refetchUserTickets();
        },
    });

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "RoundFinalized",
        onLogs() {
            refetchPools();
            refetchUserTickets();
        },
    });

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "RoundRefunded",
        onLogs() {
            refetchPools();
            refetchUserTickets();
        },
    });

    const router = useRouter();
    const { checkConnection } = useWalletProtection();

    const handleFinalizeRound = async (roundId: number, drawType: number) => {
        try {
            console.log("Requesting manual backend finalization...");
            const res = await fetch("/api/finalize", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                router.push(`/winners?drawType=${drawType}&roundId=${roundId}`);
            } else {
                console.error("Backend finalization manual trigger failed:", data.error);
                alert(`Manual finalization failed: ${data.error}`);
            }
        } catch (err: any) {
            console.error("Finalization request failed:", err);
        }
    };

    useEffect(() => {
        if (!pools) return;

        const checkAndTriggerBackendFinalize = async () => {
            let hasExpired = false;
            for (let i = 0; i < pools.length; i++) {
                const pool = pools[i];
                const initialRemaining = Number(pool.remainingTime);
                let remainingSecs = initialRemaining;
                if (initialFetchTime !== null) {
                    const elapsedSeconds = Math.floor((now - initialFetchTime) / 1000);
                    remainingSecs = Math.max(0, initialRemaining - elapsedSeconds);
                }
                if (remainingSecs <= 0 && pool.isOpen) {
                    const key = `${pool.drawType}-${pool.currentRound}`;
                    if (!sessionStorage.getItem(`finalizing-${key}`) && !sessionStorage.getItem(`finalized-${key}`)) {
                        hasExpired = true;
                        sessionStorage.setItem(`finalizing-${key}`, "true");
                    }
                }
            }

            if (hasExpired) {
                try {
                    console.log("Triggering auto backend finalization API...");
                    const res = await fetch("/api/finalize", { method: "POST" });
                    const data = await res.json();
                    if (data.success) {
                        console.log("Auto backend finalization succeeded:", data.finalizedPools);
                        data.finalizedPools.forEach((p: any) => {
                            sessionStorage.setItem(`finalized-${p.drawType}-${p.roundId}`, "true");
                            sessionStorage.removeItem(`finalizing-${p.drawType}-${p.roundId}`);
                        });
                        refetchPools();
                        refetchUserTickets();
                    } else {
                        console.error("Auto backend finalization failed:", data.error);
                    }
                } catch (err) {
                    console.error("Error calling auto backend finalization API:", err);
                }
            }
        };

        checkAndTriggerBackendFinalize();
    }, [now, pools, initialFetchTime, refetchPools, refetchUserTickets]);

    const poolColors = [
        "#C9F24A",
        "#FF5DB1",
        "#67E8F9",
        "#FACC15",
        "#A78BFA",
        "#FB923C",
    ];

    const colors = [
        "#C9F24A",
        "#FF5DB1",
        "#67E8F9",
        "#FACC15",
        "#A78BFA",
        "#FB923C",
    ];

    const draws =
        pools?.map((pool, index) => {
            const maxPrizePoolVal = pool.maxPrizePool ?? BigInt(0);
            const poolNumberVal = Number(pool.poolNumber);
            const userTickets = userTicketsData
                ? Number(userTicketsData[index]?.result ?? BigInt(0))
                : 0;

            const initialRemaining = Number(pool.remainingTime);
            const duration = Number(pool.drawDuration) > 0 ? Number(pool.drawDuration) : 600;
            const currentRound = Number(pool.currentRound);

            let remainingSecs = initialRemaining;
            let displayRound = currentRound;

            if (initialFetchTime !== null) {
                const elapsedSeconds = Math.floor((now - initialFetchTime) / 1000);
                if (elapsedSeconds < initialRemaining) {
                    remainingSecs = initialRemaining - elapsedSeconds;
                    displayRound = currentRound;
                } else {
                    const overflowSecs = elapsedSeconds - initialRemaining;
                    const additionalRounds = Math.floor(overflowSecs / duration) + 1;
                    displayRound = currentRound + additionalRounds;
                    remainingSecs = duration - (overflowSecs % duration);
                }
            }

            return {
                id: poolNumberVal,
                title: pool.poolName,
                color: colors[index],
                jackpot: `$${Number(formatEther(maxPrizePoolVal))}`,
                entries: Number(pool.currentParticipants),
                closes: formatClosesTime(remainingSecs, poolNumberVal),
                ticketPrice: `$${Number(formatEther(pool.ticketPrice))}`,
                maxPlayers: Number(pool.maxParticipants),
                round: displayRound,
                open: pool.isOpen,
                userTickets: userTickets,
            };
        }) ?? colors.map((color, index) => ({
            id: index + 1,
            title: index === 0 ? "Lucky One" : index === 1 ? "Lucky Two" : index === 2 ? "Lucky Three" : index === 3 ? "Lucky Four" : index === 4 ? "Lucky Five" : "Lucky Six",
            color: color,
            jackpot: index === 0 ? "$100" : index === 1 ? "$500" : index === 2 ? "$1000" : index === 3 ? "$2000" : index === 4 ? "$5000" : "$10000",
            entries: 0,
            closes: index === 0 ? "10 mins" : index === 1 ? "30 mins" : index === 2 ? "2 hrs" : index === 3 ? "4 hrs" : index === 4 ? "6 hrs" : "24 hrs",
            ticketPrice: "$1",
            maxPlayers: 0,
            round: 1,
            open: true,
            userTickets: 0,
        }));
    console.log(pools);
    return (
        <section className="border-t border-white/10 bg-[#17121F] py-10 sm:py-16">

            <div className="mx-auto max-w-7xl px-4 sm:px-8">

                {/* Heading */}

                <div className="mb-6 sm:mb-10 flex items-center justify-between">

                    <div>

                        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9F24A]">
                            Today's Draws
                        </p>

                        <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
                            Choose Your Lottery
                        </h2>

                    </div>

                    {/* <button className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-white transition hover:border-[#C9F24A] hover:text-[#C9F24A]">
                        View All
                        <ArrowRight size={16} />
                    </button> */}

                </div>

                {/* Cards */}

                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                    {draws.map((draw) => (

                        <div
                            key={draw.id}
                            className="group rounded-3xl border border-white/10 bg-[#1C1725] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#C9F24A]/40"
                        >

                            <div className="mb-6 flex items-center justify-between">

                                <div
                                    className="h-4 w-4 rounded-full"
                                    style={{ background: draw.color }}
                                />

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                                    Draw #{draw.id}
                                </span>

                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                {draw.title}
                            </h3>

                            <p className="mt-4 text-white/50">
                                Jackpot
                            </p>

                            <h1
                                className="mt-2 text-4xl sm:text-5xl font-black"
                                style={{ color: draw.color }}
                            >
                                {draw.jackpot}
                            </h1>

                            <div className="mt-8 space-y-4">

                                <div className="flex items-center justify-between text-sm text-white/70">

                                    <div className="flex items-center gap-2">

                                        <Award size={16} />

                                        Round

                                    </div>

                                    <span>#{draw.round}</span>

                                </div>

                                <div className="flex items-center justify-between text-sm text-white/70">

                                    <div className="flex items-center gap-2">

                                        <Users size={16} />

                                        Entries

                                    </div>

                                    <span>{draw.entries}</span>

                                </div>

                                <div className="flex items-center justify-between text-sm text-white/70">

                                    <div className="flex items-center gap-2">

                                        <Clock size={16} />

                                        Closes

                                    </div>

                                    <span>{draw.closes}</span>

                                </div>

                                {draw.userTickets > 0 && (
                                    <div className="flex items-center justify-between text-sm text-[#C9F24A] font-bold">

                                        <div className="flex items-center gap-2">

                                            <Ticket size={16} />

                                            Your Tickets

                                        </div>

                                        <span>{draw.userTickets}</span>

                                    </div>
                                )}

                            </div>

                            {draw.closes === "Closed" ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        checkConnection(() => {
                                            handleFinalizeRound(draw.round, draw.id - 1);
                                        }, "Please connect your wallet to finalize the round.");
                                    }}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FACC15] py-3 sm:py-4 font-bold text-[#17121F] transition hover:scale-[1.02]"
                                >
                                    <Award size={18} />
                                    Finalize Round
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        checkConnection(() => {
                                            router.push(`/jackpot?id=${draw.id}`);
                                        }, "Please connect your wallet before purchasing a lottery ticket.");
                                    }}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9F24A] py-3 sm:py-4 font-bold text-[#17121F] transition group-hover:scale-[1.02]"
                                >
                                    <Ticket size={18} />
                                    Buy Ticket
                                </button>
                            )}

                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}