"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    Copy,
    ExternalLink,
    Trophy,
    X,
} from "lucide-react";
import { useReadContract, useReadContracts, useWriteContract, useWatchContractEvent, usePublicClient, useAccount, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "@/config/contract";

function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} • ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

function formatPrice(amountWei: bigint): string {
    // console.log("sdhsdhshdshdshssssssssssssssssssssssssssssssssss", amountWei)
    const etherVal = Number(formatEther(amountWei));
    return `$${etherVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const pools = [
    { id: 1, name: "Lucky One", jackpot: "$100" },
    { id: 2, name: "Lucky Two", jackpot: "$500" },
    { id: 3, name: "Lucky Three", jackpot: "$1,000" },
    { id: 4, name: "Lucky Four", jackpot: "$2,000" },
    { id: 5, name: "Lucky Five", jackpot: "$5,000" },
    { id: 6, name: "Lucky Six", jackpot: "$10,000" },
];

export default function Winners() {
    const searchParams = useSearchParams();
    const urlDrawType = searchParams.get("drawType");
    const urlRoundId = searchParams.get("roundId");
    const publicClient = usePublicClient();
    const { address, isConnected, chainId } = useAccount();
    const { switchChainAsync } = useSwitchChain();
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

    const [selectedPoolId, setSelectedPoolId] = useState<number>(urlDrawType ? Number(urlDrawType) + 1 : 6);
    const [inputRoundId, setInputRoundId] = useState<string>(urlRoundId ? String(urlRoundId) : "");
    const [queryPoolId, setQueryPoolId] = useState<number>(urlDrawType ? Number(urlDrawType) + 1 : 6);
    const [queryRoundId, setQueryRoundId] = useState<number | null>(urlRoundId ? Number(urlRoundId) : null);

    const [selectedDetailRound, setSelectedDetailRound] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const currentDraw = pools.find((p) => p.id === queryPoolId) || pools[5];

    // Read all pools info to get the current active round ID
    const { data: poolsInfoData, refetch: refetchPoolsInfo } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getAllPoolsInfo",
    });
    const poolsInfo = (poolsInfoData as any[]) || [];
    const activePool = poolsInfo.find((p) => Number(p.drawType) === queryPoolId - 1);
    const currentActiveRound = activePool ? Number(activePool.currentRound) : 1;

    // Read latest completed round to auto-populate if roundId url param is not set
    const { data: latestCompleted, refetch: refetchLatestCompleted } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getLatestCompletedRound",
        args: [selectedPoolId - 1],
    });
    const latestCompletedRoundVal = latestCompleted ? Number(latestCompleted) : 0;

    useEffect(() => {
        if (latestCompletedRoundVal > 0 && !urlRoundId && !queryRoundId) {
            setInputRoundId(String(latestCompletedRoundVal));
            setQueryRoundId(latestCompletedRoundVal);
        } else if (latestCompletedRoundVal === 0 && currentActiveRound > 1 && !urlRoundId && !queryRoundId) {
            setInputRoundId(String(currentActiveRound - 1));
            setQueryRoundId(currentActiveRound - 1);
        }
    }, [latestCompletedRoundVal, currentActiveRound, urlRoundId, queryRoundId]);

    const handleSearch = () => {
        if (!inputRoundId || Number(inputRoundId) <= 0) return;
        setQueryRoundId(Number(inputRoundId));
        setQueryPoolId(selectedPoolId);
    };

    // Read Participant Count for Hero
    const { data: participantCountData, isLoading: countLoading, refetch: refetchCount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getParticipantCount",
        args: queryRoundId ? [BigInt(queryRoundId), queryPoolId - 1] : undefined,
        query: {
            enabled: !!queryRoundId,
        }
    });
    const participantCount = participantCountData ? Number(participantCountData) : 0;

    // Read Winners for Hero
    const { data: winnersData, isLoading: winnersLoading, refetch: refetchWinners } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getWinners",
        args: queryRoundId ? [BigInt(queryRoundId), queryPoolId - 1] : undefined,
        query: {
            enabled: !!queryRoundId,
        }
    });
    const winnersList = (winnersData as string[]) || [];
    const winnerAddress = winnersList.length > 0 ? winnersList[0] : null;

    // Read Prize Amounts for Hero
    const { data: prizeAmountsData, refetch: refetchPrizeAmounts } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getPrizeAmounts",
        args: queryRoundId ? [BigInt(queryRoundId), queryPoolId - 1] : undefined,
        query: {
            enabled: !!queryRoundId,
        }
    });
    console.log(prizeAmountsData);
    const prizeAmounts = (prizeAmountsData as bigint[]) || [];
    const prizeAmountVal = prizeAmounts.length > 0 ? prizeAmounts[0] : BigInt(0);

    // Read Winner Allocations for Hero
    const { data: allocationsData, refetch: refetchAllocations } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getWinnerAllocations",
        args: queryRoundId ? [BigInt(queryRoundId), queryPoolId - 1] : undefined,
        query: {
            enabled: !!queryRoundId,
        }
    });
    const allocationsList = (allocationsData as any[]) || [];

    // Read winner tickets count for Hero
    const { data: winnerTicketCountData, refetch: refetchWinnerTicket } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getUserTicketCount",
        args: queryRoundId && winnerAddress ? ([BigInt(queryRoundId), queryPoolId - 1, winnerAddress] as any) : undefined,
        query: {
            enabled: !!queryRoundId && !!winnerAddress,
        }
    });
    const winnerTicketCount = winnerTicketCountData ? Number(winnerTicketCountData) : 0;

    // Read current user ticket count
    const { data: currentUserTicketCountData, refetch: refetchCurrentUserTicket } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getUserTicketCount",
        args: queryRoundId && address ? ([BigInt(queryRoundId), queryPoolId - 1, address] as any) : undefined,
        query: {
            enabled: !!queryRoundId && !!address,
        }
    });
    const currentUserTicketCount = currentUserTicketCountData ? Number(currentUserTicketCountData) : 0;

    // Read if user claimed refund
    const { data: refundClaimedData, refetch: refetchRefundClaimed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "refundClaimed",
        args: queryRoundId && address ? [BigInt(queryRoundId), queryPoolId - 1, address] : undefined,
        query: {
            enabled: !!queryRoundId && !!address,
        }
    });
    const isRefundClaimed = !!refundClaimedData;

    // Read Round Status for Hero
    const { data: roundStatusData, refetch: refetchRoundStatus } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getRoundStatus",
        args: queryRoundId ? [BigInt(queryRoundId), queryPoolId - 1] : undefined,
        query: {
            enabled: !!queryRoundId,
        }
    });
    const roundStatusVal = roundStatusData !== undefined ? Number(roundStatusData) : 0;

    // Read Contract Statistics
    const { data: statsData, refetch: refetchStats } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getContractStatistics",
    });

    // Read User Pending Payouts
    const { data: userPendingPayout, refetch: refetchUserPendingPayout } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "pendingPayouts",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    console.log(userPendingPayout)

    // Read Winner Pending Payouts
    const { data: winnerPendingPayoutData, refetch: refetchWinnerPendingPayout } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "pendingPayouts",
        args: winnerAddress ? [winnerAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!winnerAddress,
        }
    });
    const winnerPendingPayout = winnerPendingPayoutData !== undefined ? BigInt(winnerPendingPayoutData as any) : BigInt(0);

    const [drawDateStr, setDrawDateStr] = useState<string>("—");
    const [drawDateLoading, setDrawDateLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchDate = async () => {
            if (!publicClient || !queryRoundId) return;
            setDrawDateLoading(true);
            try {
                const logs = await publicClient.getContractEvents({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    eventName: roundStatusVal === 3 || participantCount < 5 ? "RoundRefunded" : "RoundFinalized",
                    args: {
                        roundId: BigInt(queryRoundId),
                        drawType: queryPoolId - 1,
                    },
                    fromBlock: BigInt(0),
                });
                if (logs.length > 0) {
                    const block = await publicClient.getBlock({ blockNumber: logs[0].blockNumber });
                    const date = new Date(Number(block.timestamp) * 1000);
                    setDrawDateStr(formatDate(date));
                } else {
                    setDrawDateStr("—");
                }
            } catch (err) {
                console.error("Error fetching round date:", err);
                setDrawDateStr("—");
            } finally {
                setDrawDateLoading(false);
            }
        };
        fetchDate();
    }, [publicClient, queryRoundId, queryPoolId, participantCount, roundStatusVal]);

    const isCurrentUserWinner =
        !!address &&
        winnersList.some(
            (winner) =>
                winner?.toLowerCase() == address.toLowerCase()
        );

    const currentUserAllocation =
        isConnected && address
            ? allocationsList.find(
                (alloc) => alloc.winner.toLowerCase() === address.toLowerCase()
            )
            : undefined;

    const currentUserRankIndex =
        isConnected && address
            ? allocationsList.findIndex(
                (alloc) => alloc.winner.toLowerCase() === address.toLowerCase()
            )
            : -1;

    const displayPrizeVal = currentUserAllocation
        ? currentUserAllocation.allocatedPrize
        : (allocationsList.length > 0 ? allocationsList[0].allocatedPrize : prizeAmountVal);

    const userPendingPayoutVal = userPendingPayout !== undefined ? BigInt(userPendingPayout as any) : BigInt(3);
    console.log("PENDINGpAYOUT", userPendingPayoutVal, userPendingPayout)

    const canWithdraw =
        isConnected &&
        isCurrentUserWinner &&
        userPendingPayoutVal > BigInt(0);

    // Copy to clipboard helper
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // ================= WINNERS HISTORY TABLE PAGINATION =================
    const endedRoundsCount = Math.max(0, currentActiveRound - 1);
    const totalPages = Math.ceil(endedRoundsCount / 10);
    const startIndex = (currentPage - 1) * 10;
    const endIndex = Math.min(endedRoundsCount, startIndex + 10);
    const historyRounds = Array.from(
        { length: endIndex - startIndex },
        (_, i) => (currentActiveRound - 1) - startIndex - i
    );

    const contractsToRead = historyRounds.flatMap((r) => [
        {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getWinners",
            args: [BigInt(r), queryPoolId - 1],
        },
        {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getPrizeAmounts",
            args: [BigInt(r), queryPoolId - 1],
        },
        {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getParticipantCount",
            args: [BigInt(r), queryPoolId - 1],
        },
        {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getRoundStatus",
            args: [BigInt(r), queryPoolId - 1],
        },
        {
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getWinnerAllocations",
            args: [BigInt(r), queryPoolId - 1],
        }
    ]);

    const { data: multicallData, isLoading: historyLoading, refetch: refetchMulticall } = useReadContracts({
        contracts: contractsToRead as any,
        query: {
            enabled: historyRounds.length > 0,
        }
    });

    const [historyDates, setHistoryDates] = useState<Record<number, string>>({});
    const [historyTxHashes, setHistoryTxHashes] = useState<Record<number, string>>({});

    const fetchHistoryEvents = useCallback(async () => {
        if (!publicClient || historyRounds.length === 0) return;
        try {
            const [finalizedLogs, refundedLogs] = await Promise.all([
                publicClient.getContractEvents({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    eventName: "RoundFinalized",
                    args: {
                        drawType: queryPoolId - 1,
                    },
                    fromBlock: BigInt(0),
                }),
                publicClient.getContractEvents({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    eventName: "RoundRefunded",
                    args: {
                        drawType: queryPoolId - 1,
                    },
                    fromBlock: BigInt(0),
                })
            ]);

            const datesMap: Record<number, string> = {};
            const txHashesMap: Record<number, string> = {};
            const allLogs = [...finalizedLogs, ...refundedLogs];

            for (const log of allLogs) {
                const rId = Number(log.args.roundId);
                if (historyRounds.includes(rId) && !datesMap[rId]) {
                    txHashesMap[rId] = log.transactionHash;
                    try {
                        const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                        const date = new Date(Number(block.timestamp) * 1000);
                        datesMap[rId] = formatDate(date);
                    } catch (e) {
                        console.error("Error fetching block time for history:", e);
                        datesMap[rId] = "—";
                    }
                }
            }
            setHistoryDates(datesMap);
            setHistoryTxHashes(txHashesMap);
        } catch (err) {
            console.error("Error querying event logs for history dates:", err);
        }
    }, [publicClient, historyRounds.join(","), queryPoolId]);

    useEffect(() => {
        fetchHistoryEvents();
    }, [fetchHistoryEvents]);

    // Wagmi watcher hooks to refetch all on-chain states dynamically
    const refetchAllWinnersData = () => {
        refetchLatestCompleted();
        refetchPoolsInfo();
        refetchStats();
        refetchMulticall();
        refetchCount();
        refetchWinners();
        refetchPrizeAmounts();
        refetchAllocations();
        refetchWinnerTicket();
        refetchRoundStatus();
        refetchUserPendingPayout();
        refetchWinnerPendingPayout();
        refetchCurrentUserTicket();
        refetchRefundClaimed();
        fetchHistoryEvents();
    };

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "RoundFinalized",
        onLogs() {
            refetchAllWinnersData();
        },
    });

    useWatchContractEvent({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        eventName: "RoundRefunded",
        onLogs() {
            refetchAllWinnersData();
        },
    });

    const { writeContractAsync: claimRefundWrite } = useWriteContract();
    const { writeContractAsync: finalizeWrite } = useWriteContract();
    const { writeContractAsync: withdrawPayoutsWrite } = useWriteContract();

    const handleClaimRefund = async () => {
        if (!queryRoundId) return;
        try {
            await claimRefundWrite({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "claimRefund",
                args: [BigInt(queryRoundId), queryPoolId - 1],
                chainId: mstTestnet.id,
            });
            alert("Refund claimed successfully!");
            refetchAllWinnersData();
        } catch (err) {
            console.error("Claim refund failed:", err);
        }
    };

    const handleWithdrawPayout = async () => {
        if (!address) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!isCurrentUserWinner) {
            alert("You are not a winner for this round.");
            return;
        }

        if (userPendingPayoutVal <= BigInt(0)) {
            alert("No pending payout available.");
            return;
        }

        if (chainId !== mstTestnet.id && switchChainAsync) {
            try {
                await switchChainAsync({ chainId: mstTestnet.id });
            } catch (err) {
                console.error("Failed to switch network:", err);
                alert("Please switch your network to MST Testnet first.");
                return;
            }
        }

        setIsWithdrawing(true);
        try {
            console.log("Simulating withdrawPendingPayouts transaction...");
            if (publicClient) {
                await publicClient.simulateContract({
                    account: address,
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: "withdrawPendingPayouts",
                    args: [],
                });
            }

            console.log("Sending withdrawPendingPayouts transaction...");
            const txHash = await withdrawPayoutsWrite({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "withdrawPendingPayouts",
                args: [],
                chainId: mstTestnet.id,
            });

            if (publicClient && txHash) {
                console.log("Waiting for transaction receipt confirmation...", txHash);
                const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
                if (receipt.status === "success") {
                    alert("Winnings withdrawn successfully!");
                } else {
                    alert("Transaction failed on-chain.");
                }
            } else {
                alert("Winnings withdrawal submitted!");
            }
            refetchAllWinnersData();
        } catch (err: any) {
            console.error("Winnings withdrawal failed:", err);
            const revertReason = err.reason || err.shortMessage || err.message;
            alert(`Winnings withdrawal failed: ${revertReason}`);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleFinalizeRound = async () => {
        if (!queryRoundId) return;
        try {
            console.log("Attempting direct contract finalization...");
            await finalizeWrite({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "finalizeDraw",
                args: [BigInt(queryRoundId), queryPoolId - 1],
                chainId: mstTestnet.id,
            });
            alert("Round finalized successfully!");
            refetchAllWinnersData();
        } catch (err) {
            console.log("Direct contract finalization failed, falling back to backend API...", err);
            try {
                const res = await fetch("/api/finalize", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                    alert("Round finalized successfully via backend!");
                    refetchAllWinnersData();
                } else {
                    console.error("Backend finalization failed:", data.error);
                    alert(`Finalization failed: ${data.error}`);
                }
            } catch (apiErr) {
                console.error("Backend finalization failed:", apiErr);
                alert("Finalization failed.");
            }
        }
    };

    return (
        <section className="bg-[#141019] py-24">
            <div className="mx-auto max-w-7xl px-6">

                {/* ================= FILTER PANEL ================= */}
                <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1C1626] p-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">Select Pool</span>
                            <select
                                value={selectedPoolId}
                                onChange={(e) => {
                                    setSelectedPoolId(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-11 rounded-xl border border-white/10 bg-[#141019] px-4 font-mono text-[13.5px] font-semibold text-white outline-none focus:border-[#C9F24A]/40 transition min-w-[220px]"
                            >
                                {pools.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} ({p.jackpot})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">Round ID</span>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    value={inputRoundId}
                                    onChange={(e) => setInputRoundId(e.target.value)}
                                    placeholder="Round"
                                    className="h-11 w-24 rounded-xl border border-white/10 bg-[#141019] px-4 font-mono text-[13.5px] font-semibold text-white outline-none focus:border-[#C9F24A]/40 transition"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="h-11 rounded-xl bg-[#C9F24A] hover:bg-[#D9FF67] px-6 font-mono text-[13px] font-bold text-[#141019] active:scale-95 transition"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    {currentActiveRound > 1 && (
                        <div className="text-left sm:text-right">
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">Latest ended round</span>
                            <p className="font-mono text-[15px] font-bold text-[#C9F24A]">Round #{currentActiveRound - 1}</p>
                        </div>
                    )}
                </div>

                {/* ================= WINNER HERO ================= */}
                <section className="relative overflow-hidden bg-[#17121F] px-6 pt-24 pb-16 mb-12 rounded-3xl border border-white/10">
                    <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#F5B73C]/10 blur-[160px]" />
                    <div className="relative mx-auto max-w-6xl text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="flex gap-2">
                                <div className="h-8 w-3 rotate-[-12deg] rounded-full bg-[#D8FF47]" />
                                <div className="h-8 w-3 rotate-[8deg] rounded-full bg-[#FF4EA8]" />
                                <div className="h-8 w-3 rotate-[-6deg] rounded-full bg-[#F5B73C]" />
                            </div>
                        </div>

                        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.35em] text-[#F5B73C]">
                            ROUND #{queryRoundId ?? "—"} • {currentDraw.name.toUpperCase()} DRAW
                        </p>

                        {winnersLoading || countLoading || drawDateLoading ? (
                            <div className="flex h-36 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5B73C] border-t-transparent" />
                            </div>
                        ) : !queryRoundId ? (
                            <h1 className="mt-8 font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-[-0.05em] text-white md:text-6xl py-8">
                                Enter Pool & Round to query
                            </h1>
                        ) : queryRoundId >= currentActiveRound ? (
                            <h1 className="mt-8 font-['Bricolage_Grotesque'] text-4xl font-extrabold tracking-[-0.05em] text-white/55 md:text-5xl py-8">
                                Round has not ended yet (Active)
                            </h1>
                        ) : roundStatusVal === 0 ? (
                            <>
                                <h1 className="mt-8 font-['Bricolage_Grotesque'] text-6xl font-extrabold tracking-[-0.05em] text-[#F5B73C] md:text-8xl">
                                    Awaiting Finalization
                                </h1>
                                <h2 className="mt-6 font-['Bricolage_Grotesque'] text-xl font-bold tracking-tight text-white/60">
                                    Round #{queryRoundId} ended with {participantCount} participants
                                </h2>
                                <p className="mt-5 text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
                                    This round's timer has expired but the winner has not been finalized on-chain yet.
                                </p>
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleFinalizeRound}
                                        className="rounded-xl bg-[#C9F24A] hover:bg-[#D9FF67] px-10 py-5 text-lg font-bold text-[#141019] active:scale-95 transition"
                                    >
                                        Finalize Round
                                    </button>
                                </div>
                            </>
                        ) : roundStatusVal === 3 || participantCount < 5 ? (
                            <>
                                <h1 className="mt-8 font-['Bricolage_Grotesque'] text-6xl font-extrabold tracking-[-0.05em] text-red-400 md:text-8xl">
                                    Round Cancelled
                                </h1>
                                <h2 className="mt-6 font-['Bricolage_Grotesque'] text-xl font-bold tracking-tight text-white/60">
                                    Insufficient participants (&lt; 5)
                                </h2>
                                <p className="mt-5 text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
                                    This round was cancelled because fewer than 5 participants entered. All participants have been refunded.
                                </p>
                                <div className="mt-12 flex justify-center gap-4">
                                    {isConnected && currentUserTicketCount > 0 ? (
                                        isRefundClaimed ? (
                                            <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-10 py-5 text-lg font-bold text-red-300">
                                                Refunded ✓
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleClaimRefund}
                                                className="rounded-xl bg-[#F5B73C] hover:bg-[#FFC95E] px-10 py-5 text-lg font-bold text-[#241A06] transition"
                                            >
                                                Claim Refund
                                            </button>
                                        )
                                    ) : (
                                        <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-10 py-5 text-lg font-bold text-red-300">
                                            Refunded ✓
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="mt-8 font-['Bricolage_Grotesque'] text-6xl font-extrabold tracking-[-0.05em] text-white md:text-8xl">
                                    {isCurrentUserWinner
                                        ? (currentUserRankIndex === 0 ? "You won the jackpot" : `You won Rank #${currentUserRankIndex + 1} prize`)
                                        : "Jackpot Winner"}
                                </h1>
                                <h2 className="mt-6 font-['Bricolage_Grotesque'] text-[90px] font-black leading-none tracking-[-0.05em] text-[#F5B73C] md:text-[140px]">
                                    {formatPrice(displayPrizeVal)}
                                </h2>

                                {/* Loop and display first 5 winners details under the hero */}
                                <div className="mt-6 mx-auto max-w-xl space-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1 text-center">Ranked Winners</p>
                                    {allocationsList && allocationsList.length > 0 ? (
                                        allocationsList.slice(0, 5).map((alloc, index) => {
                                            const winnerAddr = alloc.winner;
                                            const allocatedPrizeVal = alloc.allocatedPrize;
                                            const pendingPayoutVal = alloc.pendingPayout;
                                            return (
                                                <div key={winnerAddr + index} className="flex justify-between items-center text-sm font-mono px-3 py-1 text-left">
                                                    <span className="text-white/60">Rank {index + 1}: {winnerAddr.slice(0, 8)}...{winnerAddr.slice(-6)}</span>
                                                    <div className="flex gap-3 text-xs">
                                                        <span className="font-semibold text-[#F5B73C]" title="Allocated Prize">Prize: {formatPrice(allocatedPrizeVal)}</span>
                                                        <span className="font-semibold text-white/20">|</span>
                                                        <span className="font-semibold text-[#C9F24A]" title="Pending Payout">Pending: {formatPrice(pendingPayoutVal)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        winnersList.slice(0, 5).map((winnerAddr, index) => {
                                            const winPrize = prizeAmounts[index] || BigInt(0);
                                            console.log(prizeAmounts, "okSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
                                            return (
                                                <div key={winnerAddr + index} className="flex justify-between items-center text-sm font-mono px-3 py-1 text-left">
                                                    <span className="text-white/60">Rank {index + 1}: {winnerAddr.slice(0, 8)}...{winnerAddr.slice(-6)}</span>
                                                    {/* <span className="font-semibold text-[#F5B73C]">{formatPrice(winPrize)}</span> */}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                                    {!isConnected ? (
                                        <button
                                            disabled
                                            className="rounded-xl bg-[#F5B73C] px-10 py-5 text-lg font-bold text-[#241A06] opacity-50 cursor-not-allowed"
                                        >
                                            Connect Wallet
                                        </button>
                                    ) : isCurrentUserWinner && userPendingPayoutVal > BigInt(0) ? (
                                        <button
                                            onClick={handleWithdrawPayout}
                                            disabled={isWithdrawing}
                                            className="rounded-xl bg-[#F5B73C] px-10 py-5 text-lg font-bold text-[#241A06] transition hover:bg-[#FFC95E] disabled:opacity-50"
                                        >
                                            {isWithdrawing ? "Withdrawing..." : "Withdraw Amount"}
                                        </button>
                                    ) : isCurrentUserWinner && userPendingPayoutVal === BigInt(0) ? (
                                        <button
                                            disabled
                                            className="rounded-xl bg-[#F5B73C] px-10 py-5 text-lg font-bold text-[#241A06] opacity-50 cursor-not-allowed"
                                        >
                                            Not Eligible
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="rounded-xl bg-white/5 border border-white/10 px-10 py-5 text-lg font-semibold text-white/40 cursor-not-allowed"
                                        >
                                            Better Luck Next Time
                                        </button>
                                    )}
                                    <button className="rounded-xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white transition hover:bg-white/10">
                                        Share your win
                                    </button>
                                    <button className="rounded-xl border border-white/10 bg-transparent px-10 py-5 text-lg font-semibold text-white transition hover:bg-white/10">
                                        Verify the draw
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* ================= TABLE ================= */}
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#17121F]">
                    {/* Header */}
                    <div className="grid grid-cols-[120px_1.5fr_160px_120px_160px_120px] border-b border-white/10 bg-[#1C1626] px-8 py-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                        <span>DRAW</span>
                        <span>WINNER</span>
                        <span>PRIZE</span>
                        <span>TICKETS</span>
                        <span>DATE</span>
                        <span className="text-right">ACTION</span>
                    </div>

                    {historyLoading ? (
                        <div className="flex h-32 items-center justify-center text-white/40 font-mono text-sm">
                            Querying smart contract history...
                        </div>
                    ) : historyRounds.length === 0 ? (
                        <div className="flex h-32 items-center justify-center text-white/40 font-mono text-sm">
                            No ended rounds yet.
                        </div>
                    ) : (
                        historyRounds.map((r, idx) => {
                            const roundWinners = multicallData?.[idx * 5]?.result as string[] | undefined;
                            const roundPrizeVal = multicallData?.[idx * 5 + 1]?.result as bigint[] | undefined;
                            const roundPartCount = multicallData?.[idx * 5 + 2]?.result as bigint | undefined;
                            const roundStatus = multicallData?.[idx * 5 + 3]?.result as number | undefined;
                            const roundAllocations = multicallData?.[idx * 5 + 4]?.result as any[] | undefined;

                            const rWinnerList = roundWinners || [];
                            const rWinner = rWinnerList.length > 0 ? rWinnerList[0] : null;
                            const rPrizeList = roundPrizeVal || [];
                            const rPrize = rPrizeList.length > 0 ? rPrizeList[0] : BigInt(0);
                            const rCount = roundPartCount ? Number(roundPartCount) : 0;
                            const rStatusNum = roundStatus !== undefined ? Number(roundStatus) : 0;
                            const rDate = historyDates[r] || "—";
                            const rTx = historyTxHashes[r] || "";

                            // Compute status string
                            let displayWinnerStr = "Unknown";
                            let statusStr = "Unknown";
                            let prizeDisplay = formatPrice(rPrize);
                            let ticketNum = rWinner ? `#${Number(BigInt(rWinner) % BigInt(200)) + 1}` : "—";

                            if (rStatusNum === 0) {
                                displayWinnerStr = "Awaiting Finalization";
                                statusStr = "Awaiting Finalization";
                                prizeDisplay = "—";
                                ticketNum = "—";
                            } else if (rStatusNum === 3 || rCount < 5) {
                                displayWinnerStr = "Cancelled";
                                statusStr = "Cancelled";
                                prizeDisplay = "$0";
                                ticketNum = "—";
                            } else {
                                displayWinnerStr = rWinner ? `${rWinner.slice(0, 6)}...${rWinner.slice(-4)}` : "Unknown";
                                statusStr = "Completed";
                            }

                            const roundInfo = {
                                round: r,
                                pool: currentDraw.jackpot,
                                winnerFull: rWinner || "0x0000000000000000000000000000000000000000",
                                winner: displayWinnerStr,
                                prize: prizeDisplay,
                                winningTicket: ticketNum,
                                date: rDate,
                                txHash: rTx,
                                participants: rCount,
                                status: statusStr,
                                reason: "Insufficient Participants",
                                refundStatus: "Completed",
                                winners: rWinnerList,
                                prizeAmounts: rPrizeList,
                                allocations: roundAllocations || [],
                            };

                            return (
                                <div
                                    key={r}
                                    onClick={() => setSelectedDetailRound(roundInfo)}
                                    className="grid grid-cols-[120px_1.5fr_160px_120px_160px_120px] items-center border-b border-white/5 px-8 py-6 transition hover:bg-white/[0.03] cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5B73C]/10">
                                            <Trophy size={18} className="text-[#F5B73C]" />
                                        </div>
                                        <span className="font-semibold text-white">
                                            #{r}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[14px] text-white/70 truncate" title={rWinner || ""}>
                                        {displayWinnerStr}
                                    </span>
                                    <span className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#F5B73C]">
                                        {prizeDisplay}
                                    </span>
                                    <span className="text-white">
                                        {ticketNum}
                                    </span>
                                    <span className="text-white/55">
                                        {rDate.split(" • ")[0]}
                                    </span>
                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => rWinner && handleCopy(rWinner)}
                                            className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                                            title="Copy Wallet Address"
                                            disabled={!rWinner}
                                        >
                                            <Copy size={16} />
                                        </button>
                                        {rTx && (
                                            <a
                                                href={`https://testnet.mstscan.com/tx/${rTx}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg border border-[#C9F24A]/30 bg-[#C9F24A]/10 p-2 text-[#C9F24A] transition hover:bg-[#C9F24A]/20"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-white/5 bg-[#1C1626] px-8 py-4">
                            <span className="font-mono text-xs text-white/40">
                                Page {currentPage} of {totalPages} ({endedRoundsCount} total rounds)
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Stats */}
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                            Total Paid
                        </p>
                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-[#F5B73C]">
                            {statsData?.[1] !== undefined ? formatPrice(statsData[1]) : "$0"}
                        </h3>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                            Total Finalized Draws
                        </p>
                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-white">
                            {statsData?.[3] !== undefined ? Number(statsData[3]).toString() : "0"}
                        </h3>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">
                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                            Total USDC Sold
                        </p>
                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-[#C9F24A]">
                            {statsData?.[0] !== undefined ? `$${Number(statsData[0]).toLocaleString()}` : "$0"}
                        </h3>
                    </div>
                </div>

            </div>

            {/* ================= DETAIL MODAL ================= */}
            {selectedDetailRound && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#17121F] p-8 shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedDetailRound(null)}
                            className="absolute right-6 top-6 text-white/50 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-white mb-6">
                            Round #{selectedDetailRound.round} Details
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Pool</p>
                                    <p className="text-base font-bold text-[#C9F24A]">{selectedDetailRound.pool}</p>
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Status</p>
                                    <p className={`text-base font-bold ${selectedDetailRound.status === "Cancelled" ? "text-red-400" :
                                        selectedDetailRound.status === "Awaiting Finalization" ? "text-yellow-400" : "text-green-400"
                                        }`}>
                                        {selectedDetailRound.status}
                                    </p>
                                </div>
                            </div>

                            {selectedDetailRound.status === "Cancelled" ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Reason</p>
                                            <p className="text-sm font-semibold text-white/70">{selectedDetailRound.reason}</p>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Participants</p>
                                            <p className="text-sm font-semibold text-white">{selectedDetailRound.participants}</p>
                                        </div>
                                    </div>
                                    <div className="border-b border-white/5 pb-4">
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Refund Status</p>
                                        <p className="text-sm font-semibold text-[#C9F24A]">{selectedDetailRound.refundStatus}</p>
                                    </div>
                                </div>
                            ) : selectedDetailRound.status === "Awaiting Finalization" ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Participants</p>
                                            <p className="text-sm font-semibold text-white">{selectedDetailRound.participants}</p>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Action</p>
                                            <button
                                                onClick={() => {
                                                    setSelectedDetailRound(null);
                                                    handleFinalizeRound();
                                                }}
                                                className="text-xs font-bold text-[#C9F24A] hover:underline"
                                            >
                                                Finalize Now
                                            </button>
                                        </div>
                                    </div>
                                    <div className="border-b border-white/5 pb-4">
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Description</p>
                                        <p className="text-xs text-white/55">This round has ended and is waiting to be finalized on-chain.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Loop and display first 5 winners details inside the modal details */}
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">Winners & Prize Breakdown</p>
                                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                                            {selectedDetailRound.allocations && selectedDetailRound.allocations.length > 0 ? (
                                                selectedDetailRound.allocations.slice(0, 5).map((alloc: any, index: number) => {
                                                    const winnerAddr = alloc.winner;
                                                    const allocatedPrizeVal = alloc.allocatedPrize;
                                                    const pendingPayoutVal = alloc.pendingPayout;
                                                    return (
                                                        <div key={winnerAddr + index} className="flex justify-between items-center text-xs font-mono bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="text-white/60 text-left">R{index + 1}: {winnerAddr.slice(0, 6)}...{winnerAddr.slice(-4)}</span>
                                                                <button
                                                                    onClick={() => handleCopy(winnerAddr)}
                                                                    className="text-white/40 hover:text-white transition"
                                                                    title="Copy Address"
                                                                >
                                                                    <Copy size={11} />
                                                                </button>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <span className="font-semibold text-[#F5B73C]">Prize: {formatPrice(allocatedPrizeVal)}</span>
                                                                <span className="text-white/30">|</span>
                                                                <span className="font-semibold text-[#C9F24A]">Pending: {formatPrice(pendingPayoutVal)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                selectedDetailRound.winners.slice(0, 5).map((winnerAddr: string, index: number) => {
                                                    const winPrize = selectedDetailRound.prizeAmounts[index] || BigInt(0);
                                                    return (
                                                        <div key={winnerAddr + index} className="flex justify-between items-center text-xs font-mono bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <span className="text-white/60 text-left">R{index + 1}: {winnerAddr.slice(0, 6)}...{winnerAddr.slice(-4)}</span>
                                                                <button
                                                                    onClick={() => handleCopy(winnerAddr)}
                                                                    className="text-white/40 hover:text-white transition"
                                                                    title="Copy Address"
                                                                >
                                                                    <Copy size={11} />
                                                                </button>
                                                            </div>
                                                            <span className="font-semibold text-[#F5B73C]">{formatPrice(winPrize)}</span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Participants</p>
                                            <p className="text-base font-bold text-white">{selectedDetailRound.participants}</p>
                                        </div>
                                        <div>
                                            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">Draw Date</p>
                                            <p className="text-base font-semibold text-white/75">{selectedDetailRound.date}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedDetailRound.txHash && (
                                <div className="pt-2">
                                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">Transaction Hash</p>
                                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3">
                                        <span className="font-mono text-xs text-white/60 truncate flex-1">{selectedDetailRound.txHash}</span>
                                        <button
                                            onClick={() => handleCopy(selectedDetailRound.txHash)}
                                            className="text-white/50 hover:text-white transition"
                                            title="Copy Hash"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <a
                                            href={`https://testnet.mstscan.com/tx/${selectedDetailRound.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#C9F24A] hover:text-white transition"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}