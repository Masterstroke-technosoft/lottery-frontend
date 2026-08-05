"use client";

import {
    Wallet,
    Smartphone,
    Mail,
    X,
    CheckCircle2,
} from "lucide-react";

export default function ConnectWallet() {
    return (
        <section className="py-24 bg-[#141019]">

            <div className="mx-auto max-w-[760px] px-6">

                <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#17121F] shadow-[0_30px_80px_rgba(0,0,0,.35)]">

                    {/* Header */}

                    <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">

                        <div>

                            <h2 className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-white">

                                Connect to play

                            </h2>

                            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/55">

                                Tickets, prizes and referral earnings are all tied
                                to your wallet. We never ask for a signature to
                                read your balance.

                            </p>

                        </div>

                        <button className="rounded-lg border border-white/10 p-2 text-white/50 transition hover:bg-white/10 hover:text-white">

                            <X size={22} />

                        </button>

                    </div>

                    {/* Wallet Options */}

                    <div className="space-y-4 p-8">

                        {/* Browser Wallet */}

                        <button className="group flex w-full items-center justify-between rounded-2xl border border-[#C9F24A]/30 bg-[#1C1626] p-5 transition hover:border-[#C9F24A] hover:bg-[#221B2E]">

                            <div className="flex items-center gap-4">

                                <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#C9F24A]/10">

                                    <Wallet
                                        size={28}
                                        className="text-[#C9F24A]"
                                    />

                                </div>

                                <div className="text-left">

                                    <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-white">

                                        Browser wallet

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Detected

                                    </p>

                                </div>

                            </div>

                            <span className="rounded-full bg-[#C9F24A]/15 px-4 py-2 font-mono text-xs font-semibold tracking-[0.12em] text-[#C9F24A]">

                                READY

                            </span>

                        </button>

                        {/* Mobile */}

                        <button className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#1C1626] p-5 transition hover:border-white/30">

                            <div className="flex items-center gap-4">

                                <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">

                                    <Smartphone
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div className="text-left">

                                    <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-white">

                                        Mobile wallet

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Scan a QR code

                                    </p>

                                </div>

                            </div>

                        </button>

                        {/* Email */}

                        <button className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#1C1626] p-5 transition hover:border-white/30">

                            <div className="flex items-center gap-4">

                                <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/5">

                                    <Mail
                                        size={28}
                                        className="text-white"
                                    />

                                </div>

                                <div className="text-left">

                                    <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-white">

                                        Email or social

                                    </h3>

                                    <p className="mt-1 text-sm text-white/45">

                                        Wallet created for you

                                    </p>

                                </div>

                            </div>

                        </button>

                        {/* Referral */}

                        <div className="mt-6 rounded-xl border border-[#FF5DB1]/30 bg-[#FF5DB1]/10 p-5">

                            <div className="flex items-center gap-3">

                                <CheckCircle2
                                    className="text-[#FF5DB1]"
                                    size={22}
                                />

                                <div>

                                    <p className="font-mono text-[11px] tracking-[0.15em] text-[#FF5DB1]">

                                        CODE

                                    </p>

                                    <h3 className="mt-1 font-semibold text-white">

                                        Invited by <span className="text-[#FF5DB1]">MOONBOY</span> — code applied

                                    </h3>

                                </div>

                            </div>

                        </div>

                        {/* Footer */}

                        <p className="pt-2 text-center text-sm text-white/35">

                            18+ only. Play for fun, not for income.

                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}