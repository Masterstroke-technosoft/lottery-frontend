"use client";

import { useEffect, useState } from "react";

const leaderboardData = [
    {
        rank: 4,
        code: "LUCKY7",
        players: 96,
        tickets: 288,
        share: "4%",
        payout: "$113",
    },
    {
        rank: 5,
        code: "TICKETFAIRY",
        players: 74,
        tickets: 241,
        share: "4%",
        payout: "$113",
    },
    {
        rank: 6,
        code: "SIXSHOOTER",
        players: 61,
        tickets: 205,
        share: "4%",
        payout: "$113",
    },
    {
        rank: 7,
        code: "NIGHTOWL",
        players: 55,
        tickets: 178,
        share: "4%",
        payout: "$113",
    },
    {
        rank: 8,
        code: "HOTSTREAK",
        players: 43,
        tickets: 140,
        share: "4%",
        payout: "$113",
    },
    {
        rank: 9,
        code: "COINFLIP",
        players: 38,
        tickets: 122,
        share: "4%",
        payout: "$113",
    },
];

export default function LeaderboardPage() {
    return (
        <section className="min-h-screen bg-[#0E0B13] text-[#F4F0F7] pb-24">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-10 pt-8 sm:pt-12">

                {/* ================= HERO & HEADER ================= */}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex flex-wrap items-center gap-1.5">
                            Top referrers <span className="hidden sm:inline text-white/40 font-normal text-xl">&bull;</span> <span className="text-white/60 text-sm sm:text-xl font-normal">Set #418</span>
                        </h1>
                        <p className="mt-1 text-[13px] text-white/60">
                            Ranked by tickets driven. The 10% referral pool — <span className="text-[#FF5DB1] font-semibold">$2,834</span> today — is paid out by rank when the set settles.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-1 rounded-xl bg-[#141019] p-0.5 border border-white/[0.04] self-start md:self-auto">
                        <button className="h-[30px] rounded-lg bg-[#C9F24A] px-4 text-xs font-bold text-black cursor-pointer">
                            This set
                        </button>
                        <button className="h-[30px] rounded-lg px-4 text-xs font-semibold text-white/40 hover:text-white/80 cursor-pointer">
                            7 days
                        </button>
                        <button className="h-[30px] rounded-lg px-4 text-xs font-semibold text-white/40 hover:text-white/80 cursor-pointer">
                            All time
                        </button>
                    </div>
                </div>

                {/* ================= TOP CARDS GRID ================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:items-end mb-8">

                    {/* Rank #2 */}
                    <div className="order-2 md:order-1 rounded-[18px] border border-white/[0.06] bg-[#141019] p-6 h-[160px] flex flex-col justify-between relative">
                        <div className="flex items-start justify-between">
                            <span className="text-3xl font-black text-white/20 leading-none">#2</span>
                            <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold text-white/40 tracking-wider">
                                15% OF POOL
                            </span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">SIXPACK</h3>
                            <div className="flex items-end justify-between mt-2 leading-none">
                                <span className="text-[12px] text-white/40">380 tickets</span>
                                <span className="text-lg font-black text-white">$425</span>
                            </div>
                        </div>
                    </div>

                    {/* Rank #1 */}
                    <div className="order-1 md:order-2 rounded-[18px] border border-[#C9F24A]/40 bg-[#1C1824] p-6 h-auto min-h-[160px] md:h-[180px] py-6 flex flex-col justify-between relative shadow-[0_0_30px_rgba(201,242,74,0.03)]">
                        <div className="flex items-start justify-between">
                            <span className="text-4xl font-black text-[#C9F24A] leading-none">#1</span>
                            <span className="rounded bg-[#C9F24A]/10 border border-[#C9F24A]/25 px-2 py-0.5 text-[9px] font-bold text-[#C9F24A] tracking-wider">
                                25% OF POOL
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">DEGENQUEEN</h3>
                            <div className="flex flex-wrap items-baseline justify-between mt-2 leading-none gap-2">
                                <span className="text-[12px] text-white/40">604 tickets &bull; 214 players</span>
                                <span className="text-2xl font-black text-[#C9F24A]">$708</span>
                            </div>
                        </div>
                    </div>

                    {/* Rank #3 */}
                    <div className="order-3 rounded-[18px] border border-white/[0.06] bg-[#141019] p-6 h-[160px] flex flex-col justify-between relative">
                        <div className="flex items-start justify-between">
                            <span className="text-3xl font-black text-[#FF5DB1] leading-none">#3</span>
                            <span className="rounded bg-[#FF5DB1]/10 border border-[#FF5DB1]/25 px-2 py-0.5 text-[9px] font-bold text-[#FF5DB1] tracking-wider">
                                10% OF POOL
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-black text-white tracking-tight">MOONBOY</h3>
                                <span className="rounded bg-[#C9F24A] px-1.5 py-0.5 text-[9px] font-extrabold text-[#141019] leading-none">
                                    YOU
                                </span>
                            </div>
                            <div className="flex items-end justify-between mt-2 leading-none">
                                <span className="text-[12px] text-white/40">412 tickets</span>
                                <span className="text-lg font-black text-white">$284</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= LEADERBOARD TABLE ================= */}

                <div className="overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#141019]">
                    {/* Table Header */}
                    <div className="grid grid-cols-[50px_1.5fr_1fr_1fr] md:grid-cols-[80px_2.5fr_1.5fr_1.5fr_1.5fr_1.2fr] border-b border-white/[0.06] bg-white/[0.01] px-4 md:px-8 py-3.5 text-[10px] font-bold tracking-wider text-white/35 uppercase">
                        <span>RANK</span>
                        <span>CODE</span>
                        <span className="hidden md:block text-center">PLAYERS</span>
                        <span className="text-center">TICKETS</span>
                        <span className="hidden md:block text-center">SHARE</span>
                        <span className="text-right">PAYOUT</span>
                    </div>

                    {/* Table Rows */}
                    {leaderboardData.map((user) => (
                        <div
                            key={user.rank}
                            className="grid grid-cols-[50px_1.5fr_1fr_1fr] md:grid-cols-[80px_2.5fr_1.5fr_1.5fr_1.5fr_1.2fr] items-center border-b border-white/[0.03] px-4 md:px-8 py-4 transition hover:bg-white/[0.01]"
                        >
                            <span className="text-sm font-black text-white/40">
                                {user.rank}
                            </span>

                            <span className="text-sm font-bold text-white truncate">
                                {user.code}
                            </span>

                            <span className="hidden md:block text-center text-sm text-white/60 font-medium">
                                {user.players}
                            </span>

                            <span className="text-center text-sm text-white/60 font-medium">
                                {user.tickets}
                            </span>

                            <span className="hidden md:block text-center text-sm text-white/60 font-medium">
                                {user.share}
                            </span>

                            <span className="text-right text-sm font-bold text-white/80 font-mono">
                                {user.payout}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}