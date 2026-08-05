"use client";

import {
    Copy,
    ExternalLink,
    Trophy,
} from "lucide-react";

const winners = [
    {
        draw: "#417",
        wallet: "0x82fa...9a1d",
        prize: "$10,000",
        tickets: 3,
        date: "12 Jul 2026",
        tx: "#",
    },
    {
        draw: "#416",
        wallet: "0x19ab...82fd",
        prize: "$10,000",
        tickets: 8,
        date: "11 Jul 2026",
        tx: "#",
    },
    {
        draw: "#415",
        wallet: "0x73de...77bc",
        prize: "$10,000",
        tickets: 2,
        date: "10 Jul 2026",
        tx: "#",
    },
    {
        draw: "#414",
        wallet: "0x51fe...28dc",
        prize: "$10,000",
        tickets: 6,
        date: "09 Jul 2026",
        tx: "#",
    },
];

export default function Winners() {
    return (
        <section className="bg-[#141019] py-24">

            <div className="mx-auto max-w-7xl px-6">

                {/* ================= WINNER HERO ================= */}

                <section className="relative overflow-hidden bg-[#17121F] px-6 pt-24 pb-16">

                    {/* Background Glow */}

                    <div className="absolute left-1/2 top-0 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#F5B73C]/10 blur-[160px]" />

                    <div className="relative mx-auto max-w-6xl text-center">

                        {/* Lucky Six Logo */}

                        <div className="mb-8 flex justify-center">

                            <div className="flex gap-2">

                                <div className="h-8 w-3 rotate-[-12deg] rounded-full bg-[#D8FF47]" />

                                <div className="h-8 w-3 rotate-[8deg] rounded-full bg-[#FF4EA8]" />

                                <div className="h-8 w-3 rotate-[-6deg] rounded-full bg-[#F5B73C]" />

                            </div>

                        </div>

                        {/* Draw */}

                        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.35em] text-[#F5B73C]">

                            SET #418 • JACKPOT DRAW

                        </p>

                        {/* Title */}

                        <h1 className="mt-8 font-['Bricolage_Grotesque'] text-6xl font-extrabold tracking-[-0.05em] text-white md:text-8xl">

                            You won the jackpot

                        </h1>

                        {/* Amount */}

                        <h2 className="mt-6 font-['Bricolage_Grotesque'] text-[110px] font-black leading-none tracking-[-0.05em] text-[#F5B73C] md:text-[170px]">

                            $10,000

                        </h2>

                        {/* Ticket */}

                        <p className="mt-5 text-xl text-white/60">

                            Ticket

                            <span className="mx-2 font-semibold text-white">

                                #418-JP-0442

                            </span>

                            · drawn 00:00:00 UTC

                        </p>

                        {/* Buttons */}

                        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">

                            <button className="rounded-xl bg-[#F5B73C] px-10 py-5 text-lg font-bold text-[#241A06] transition hover:bg-[#FFC95E]">

                                Paid to 0x7a...3f9c ✓

                            </button>

                            <button className="rounded-xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-semibold text-white transition hover:bg-white/10">

                                Share your win

                            </button>

                            <button className="rounded-xl border border-white/10 bg-transparent px-10 py-5 text-lg font-semibold text-white transition hover:bg-white/10">

                                Verify the draw

                            </button>

                        </div>

                        {/* Referral Banner */}

                        <div className="mx-auto mt-16 flex max-w-5xl items-center justify-between rounded-2xl border border-[#FF4EA8]/25 bg-[#311D33] px-8 py-6">

                            <p className="text-lg text-white/75">

                                Your referrer

                                <span className="mx-1 font-bold text-[#FF4EA8]">

                                    @moonboy

                                </span>

                                earned

                                <span className="mx-1 font-bold text-white">

                                    $284.10

                                </span>

                                from this set. Your own code has

                                <span className="mx-1 font-bold text-white">

                                    12 players

                                </span>

                                in it.

                            </p>

                            <button className="font-semibold text-[#FF4EA8] transition hover:text-pink-300">

                                Open referral dashboard →

                            </button>

                        </div>

                    </div>

                </section>

                {/* Table */}

                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#17121F]">

                    {/* Header */}

                    <div className="grid grid-cols-[120px_1.5fr_160px_120px_160px_120px] border-b border-white/10 bg-[#1C1626] px-8 py-5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">

                        <span>DRAW</span>

                        <span>WINNER</span>

                        <span>PRIZE</span>

                        <span>TICKETS</span>

                        <span>DATE</span>

                        <span className="text-right">
                            ACTION
                        </span>

                    </div>

                    {winners.map((winner) => (

                        <div
                            key={winner.draw}
                            className="grid grid-cols-[120px_1.5fr_160px_120px_160px_120px] items-center border-b border-white/5 px-8 py-6 transition hover:bg-white/[0.03]"
                        >

                            <div className="flex items-center gap-3">

                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5B73C]/10">

                                    <Trophy
                                        size={18}
                                        className="text-[#F5B73C]"
                                    />

                                </div>

                                <span className="font-semibold text-white">

                                    {winner.draw}

                                </span>

                            </div>

                            <span className="font-mono text-[14px] text-white/70">

                                {winner.wallet}

                            </span>

                            <span className="font-['Bricolage_Grotesque'] text-[22px] font-bold text-[#F5B73C]">

                                {winner.prize}

                            </span>

                            <span className="text-white">

                                {winner.tickets}

                            </span>

                            <span className="text-white/55">

                                {winner.date}

                            </span>

                            <div className="flex justify-end gap-2">

                                <button className="rounded-lg border border-white/10 p-2 text-white/60 transition hover:bg-white/10 hover:text-white">

                                    <Copy size={16} />

                                </button>

                                <button className="rounded-lg border border-[#C9F24A]/30 bg-[#C9F24A]/10 p-2 text-[#C9F24A] transition hover:bg-[#C9F24A]/20">

                                    <ExternalLink size={16} />

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Bottom Stats */}

                <div className="mt-12 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">

                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">

                            Total Paid

                        </p>

                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-[#F5B73C]">

                            $4.7M

                        </h3>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">

                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">

                            Winners

                        </p>

                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-white">

                            417

                        </h3>

                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#17121F] p-6">

                        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">

                            Largest Prize

                        </p>

                        <h3 className="mt-4 font-['Bricolage_Grotesque'] text-4xl font-bold text-[#C9F24A]">

                            $250K

                        </h3>

                    </div>

                </div>

            </div>

        </section>
    );
}