"use client";

import { useState } from "react";
import Link from "next/link";

interface WinnerCard {
    amount: string;
    wallet: string;
    isUser?: boolean;
    isJackpot?: boolean;
}

interface DrawSet {
    setNumber: number;
    date: string;
    settledTime?: string;
    status?: string;
    tickets: number;
    topReferrer?: string;
    winnersCount: number;
    totalPaid: string;
    winners?: WinnerCard[];
}

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"every" | "jackpot" | "wins">("wins");
    const [expandedSets, setExpandedSets] = useState<number[]>([417]);

    // Mock data matching the design
    const initialSets: DrawSet[] = [
        {
            setNumber: 417,
            date: "27 Jul 2026",
            settledTime: "00:00 UTC",
            status: "ALL PAID",
            tickets: 4308,
            topReferrer: "DEGENQUEEN",
            winnersCount: 6,
            totalPaid: "$22,600",
            winners: [
                { amount: "$100", wallet: "0x12aa...9d31" },
                { amount: "$1,000", wallet: "0x5f01...b2c8" },
                { amount: "$2,000", wallet: "0x9ce3...4471" },
                { amount: "$4,500", wallet: "you • won", isUser: true },
                { amount: "$5,000", wallet: "0x77b9...041e" },
                { amount: "$10,000", wallet: "0xe480...1a66", isJackpot: true },
            ],
        },
        {
            setNumber: 416,
            date: "26 Jul 2026",
            tickets: 3914,
            winnersCount: 6,
            totalPaid: "$22,600",
            winners: [
                { amount: "$100", wallet: "0x12aa...9d31" },
                { amount: "$1,000", wallet: "0x5f01...b2c8" },
                { amount: "$2,000", wallet: "0x9ce3...4471" },
                { amount: "$4,500", wallet: "0x38b9...c39f" },
                { amount: "$5,000", wallet: "0x77b9...041e" },
                { amount: "$10,000", wallet: "0xe480...1a66", isJackpot: true },
            ],
        },
        {
            setNumber: 415,
            date: "25 Jul 2026",
            tickets: 4102,
            winnersCount: 6,
            totalPaid: "$22,600",
            winners: [
                { amount: "$100", wallet: "0x12aa...9d31" },
                { amount: "$1,000", wallet: "0x5f01...b2c8" },
                { amount: "$2,000", wallet: "0x9ce3...4471" },
                { amount: "$4,500", wallet: "you • won", isUser: true },
                { amount: "$5,000", wallet: "0x77b9...041e" },
                { amount: "$10,000", wallet: "0xe480...1a66", isJackpot: true },
            ],
        },
        {
            setNumber: 414,
            date: "24 Jul 2026",
            tickets: 3660,
            winnersCount: 6,
            totalPaid: "$22,600",
            winners: [
                { amount: "$100", wallet: "0x12aa...9d31" },
                { amount: "$1,000", wallet: "0x5f01...b2c8" },
                { amount: "$2,000", wallet: "0x9ce3...4471" },
                { amount: "$4,500", wallet: "0x38b9...c39f" },
                { amount: "$5,000", wallet: "0x77b9...041e" },
                { amount: "$10,000", wallet: "0x89ac...91f2", isJackpot: true },
            ],
        },
    ];

    const [sets, setSets] = useState<DrawSet[]>(initialSets);

    const toggleExpandSet = (setNumber: number) => {
        if (expandedSets.includes(setNumber)) {
            setExpandedSets(expandedSets.filter((id) => id !== setNumber));
        } else {
            setExpandedSets([...expandedSets, setNumber]);
        }
    };

    const handleExportCSV = () => {
        // Generate CSV content
        const headers = "Set,Date,Tickets,Winners Count,Total Paid,User Won,Jackpot Won\n";
        const rows = sets
            .map(
                (s) =>
                    `${s.setNumber},${s.date},${s.tickets},${s.winnersCount},${s.totalPaid},${s.winners?.some((w) => w.isUser) ? "Yes" : "No"
                    },${s.winners?.some((w) => w.isJackpot) ? "Yes" : "No"}`
            )
            .join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `draw_history_export.csv`);
        a.click();
    };

    const loadOlderSets = () => {
        const nextSetNumber = Math.min(...sets.map((s) => s.setNumber)) - 1;
        if (nextSetNumber < 400) return;

        const dates = ["23 Jul 2026", "22 Jul 2026", "21 Jul 2026", "20 Jul 2026"];
        const dateIndex = (417 - nextSetNumber) % dates.length;

        const newSet: DrawSet = {
            setNumber: nextSetNumber,
            date: dates[dateIndex],
            tickets: Math.floor(Math.random() * 1000) + 3500,
            winnersCount: 6,
            totalPaid: "$22,600",
            winners: [
                { amount: "$100", wallet: "0x12aa...9d31" },
                { amount: "$1,000", wallet: "0x5f01...b2c8" },
                { amount: "$2,000", wallet: "0x9ce3...4471" },
                { amount: "$4,500", wallet: Math.random() > 0.5 ? "you • won" : "0x38b9...c39f", isUser: Math.random() > 0.5 },
                { amount: "$5,000", wallet: "0x77b9...041e" },
                { amount: "$10,000", wallet: "0xe480...1a66", isJackpot: true },
            ],
        };

        setSets([...sets, newSet]);
    };

    // Filter and search logic
    const filteredSets = sets.filter((set) => {
        // Search query check
        const matchesSearch =
            searchQuery === "" ||
            set.setNumber.toString().includes(searchQuery) ||
            set.topReferrer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            set.winners?.some((w) => w.wallet.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;

        // Filter check
        if (activeFilter === "wins") {
            return set.winners?.some((w) => w.isUser);
        }
        if (activeFilter === "jackpot") {
            return set.winners?.some((w) => w.isJackpot);
        }
        return true;
    });

    return (
        <section className="min-h-screen bg-[#0E0B13] text-[#F4F0F7] pb-24">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-10 pt-8 sm:pt-12">
                {/* ================= HEADER ================= */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F4F0F7]">
                            Past draw sets
                        </h1>
                        <p className="mt-2.5 text-[14px] sm:text-[15px] font-medium text-white/40">
                            417 sets settled &bull; 2,502 winners paid &bull; $9.14M distributed since launch
                        </p>
                    </div>

                    {/* Controls & Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search set, wallet or code..."
                                className="h-10 w-full sm:w-[240px] rounded-lg bg-[#1B1622] border border-white/[0.08] px-4 text-xs text-white placeholder-white/30 focus:border-[#C9F24A]/40 focus:outline-none transition font-medium"
                            />
                        </div>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportCSV}
                            className="w-full sm:w-auto h-10 rounded-lg bg-[#1B1622] hover:bg-[#251F2F] border border-white/[0.08] px-4 text-xs font-semibold text-white/90 active:scale-95 transition cursor-pointer text-center"
                        >
                            Export CSV
                        </button>

                        {/* Filters */}
                        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-2 rounded-xl bg-[#141019] p-1 border border-white/[0.03]">
                            <button
                                onClick={() => setActiveFilter("every")}
                                className={`flex-1 sm:flex-none h-[38px] rounded-lg px-3 sm:px-4 text-xs font-bold transition-all cursor-pointer ${activeFilter === "every"
                                    ? "bg-[#C9F24A] text-black"
                                    : "text-white/40 hover:text-white/80"
                                    }`}
                            >
                                Every draw
                            </button>
                            <button
                                onClick={() => setActiveFilter("jackpot")}
                                className={`flex-1 sm:flex-none h-[38px] rounded-lg px-3 sm:px-4 text-xs font-bold transition-all cursor-pointer ${activeFilter === "jackpot"
                                    ? "bg-[#C9F24A] text-black"
                                    : "text-white/40 hover:text-white/80"
                                    }`}
                            >
                                Jackpot only
                            </button>
                            <button
                                onClick={() => setActiveFilter("wins")}
                                className={`flex-1 sm:flex-none h-[38px] rounded-lg px-3 sm:px-4 text-xs font-bold transition-all cursor-pointer ${activeFilter === "wins"
                                    ? "bg-[#C9F24A] text-black"
                                    : "text-white/40 hover:text-white/80"
                                    }`}
                            >
                                My wins
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= DRAW SETS LIST ================= */}
                <div className="mt-8 space-y-4">
                    {filteredSets.length > 0 ? (
                        filteredSets.map((set) => {
                            const isExpanded = expandedSets.includes(set.setNumber);

                            return (
                                <div
                                    key={set.setNumber}
                                    className={`rounded-[22px] border border-white/[0.08] transition-all duration-300 ${isExpanded ? "bg-[#1B1622] p-5 sm:p-8" : "bg-[#141019] hover:bg-[#1B1622]/40 px-4 sm:px-8 py-5 sm:py-[22px]"
                                        }`}
                                >
                                    {/* Item Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <span className="text-[17px] font-black text-white">
                                                Set #{set.setNumber}
                                            </span>
                                            <span className="text-[14px] sm:text-[15px] font-medium text-white/30">
                                                {set.date}
                                            </span>
                                            {isExpanded && set.settledTime && (
                                                <>
                                                    <span className="hidden sm:inline text-[15px] font-medium text-white/30">-</span>
                                                    <span className="text-[14px] sm:text-[15px] font-medium text-white/30">
                                                        settled {set.settledTime}
                                                    </span>
                                                </>
                                            )}
                                            {isExpanded && set.status && (
                                                <span className="ml-1 rounded-md bg-[#C9F24A]/10 border border-[#C9F24A]/25 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#C9F24A]">
                                                    {set.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 w-full md:w-auto">
                                            {isExpanded ? (
                                                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 w-full">
                                                    <div className="text-[13px] sm:text-[15px] font-medium text-white/30">
                                                        {set.tickets.toLocaleString()} tickets &bull; top referrer{" "}
                                                        <span className="font-bold text-[#FF5DB1]">{set.topReferrer}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleExpandSet(set.setNumber)}
                                                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                                                    >
                                                        Collapse
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 w-full">
                                                    <span className="text-[13px] sm:text-[15px] font-medium text-white/30">
                                                        {set.tickets.toLocaleString()} tickets &bull; {set.winnersCount} winners &bull; {set.totalPaid} paid
                                                    </span>
                                                    <button
                                                        onClick={() => toggleExpandSet(set.setNumber)}
                                                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                                                    >
                                                        Expand
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Grid Content */}
                                    {isExpanded && set.winners && (
                                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                                            {set.winners.map((winner, idx) => {
                                                let cardClass =
                                                    "rounded-[18px] bg-[#120F17] p-4 sm:p-5 border border-white/[0.04] flex flex-col justify-between h-[96px]";
                                                let amountClass = "text-lg sm:text-xl font-bold text-white";
                                                let walletClass = "text-[11px] sm:text-xs font-mono font-medium text-white/35 truncate";

                                                if (winner.isUser) {
                                                    cardClass =
                                                        "rounded-[18px] bg-[#17211E]/40 p-4 sm:p-5 border border-[#C9F24A]/30 flex flex-col justify-between h-[96px]";
                                                    amountClass = "text-lg sm:text-xl font-bold text-[#C9F24A]";
                                                    walletClass = "text-[11px] sm:text-xs font-mono font-bold text-[#C9F24A]/70 truncate";
                                                } else if (winner.isJackpot) {
                                                    cardClass =
                                                        "rounded-[18px] bg-[#221A16]/40 p-4 sm:p-5 border border-[#E8B854]/30 flex flex-col justify-between h-[96px]";
                                                    amountClass = "text-lg sm:text-xl font-bold text-[#E8B854]";
                                                    walletClass = "text-[11px] sm:text-xs font-mono font-bold text-[#E8B854]/70 truncate";
                                                }

                                                return (
                                                    <div key={idx} className={cardClass}>
                                                        <span className={amountClass}>{winner.amount}</span>
                                                        <span className={walletClass} title={winner.wallet}>{winner.wallet}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-[22px] border border-white/[0.05] bg-[#141019] py-16 text-center">
                            <p className="text-white/40 font-semibold">No draw sets match the search query.</p>
                        </div>
                    )}
                </div>

                {/* Load older sets button */}
                {filteredSets.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={loadOlderSets}
                            className="rounded-xl border border-white/[0.08] bg-[#141019] hover:bg-[#1B1622] px-6 py-3.5 text-[13px] font-bold text-white transition active:scale-95 cursor-pointer"
                        >
                            Load older sets
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
