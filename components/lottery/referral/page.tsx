"use client";
import { useEffect, useState } from "react";
export default function ReferralPage() {

  const referralLink = "https://luckysix.xyz/join/MOONBOY";

  const [copied, setCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    hours: 17,
    minutes: 45,
    seconds: 27,
  });

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

        return {
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="min-h-screen bg-[#17121F] text-white">
      <div className="mx-auto max-w-[1700px] px-4 sm:px-12 py-6 sm:py-12">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">

          <div>

            <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF5DB1] uppercase">
              ★ Referral Program
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
              Earn 10% of Ticket Sales
            </h2>

          </div>

          {/* Timer */}

          <div className="rounded-full border border-white/10 bg-[#221B2E] px-5 py-[11px] self-start sm:self-auto">

            <div className="flex items-center gap-3">

              <span className="font-mono text-[11.5px] tracking-[0.18em] text-white/40">
                SET CLOSES
              </span>

              <span className="text-[#C9F24A] font-mono font-bold text-[13.5px]">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_470px] gap-6 sm:gap-10">

          {/* LEFT */}

          <div className="space-y-8">

            {/* ================= REFERRAL CODE CARD ================= */}

            <div className="transition-all duration-300 hover:border-[#FF5DB1]/40 border border-[#5E2B55] bg-[#2A1D34]/40 p-5 sm:p-8 rounded-[22px]">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

                <div>

                  <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-[#FF5DB1]">
                    YOUR CODE
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4">

                    <h2 className="text-4xl sm:text-5xl font-black leading-none tracking-tight text-white">
                      MOONBOY
                    </h2>

                    <button
                      onClick={copyReferral}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:scale-105 transition active:scale-95 cursor-pointer"
                    >
                      {copied ? "Copied ✓" : "Copy link"}
                    </button>

                  </div>

                  <p className="mt-4 font-mono text-sm sm:text-base text-white/40 break-all">
                    luckysix.xyz/join/MOONBOY
                  </p>

                </div>

                {/* QR Code */}

                <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-[22px] border border-white/5 bg-[repeating-linear-gradient(45deg,#321c3d_0px,#321c3d_6px,#22142b_6px,#22142b_12px)]">

                  <div className="text-center font-mono text-[10px] tracking-widest text-white/30">
                    <p>QR</p>
                    <p>CODE</p>
                  </div>

                </div>

              </div>

            </div>

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/5 gap-px">

              {/* Earned */}

              <div className="bg-[#22192D] p-5 sm:p-6 flex flex-col justify-between min-h-[120px]">

                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Earned this set
                </p>

                <h2 className="text-[24px] sm:text-[28px] font-black text-[#FF5DB1] mt-2">
                  $284.10
                </h2>

              </div>

              {/* All Time */}

              <div className="bg-[#22192D] p-5 sm:p-6 flex flex-col justify-between min-h-[120px]">

                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  All Time
                </p>

                <h2 className="text-[24px] sm:text-[28px] font-black text-white mt-2">
                  $6,140
                </h2>

              </div>

              {/* Players */}

              <div className="bg-[#22192D] p-5 sm:p-6 flex flex-col justify-between min-h-[120px]">

                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Players Referred
                </p>

                <h2 className="text-[24px] sm:text-[28px] font-black text-white mt-2">
                  128
                </h2>

              </div>

              {/* Tickets */}

              <div className="bg-[#22192D] p-5 sm:p-6 flex flex-col justify-between min-h-[120px]">

                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Tickets Driven
                </p>

                <h2 className="text-[24px] sm:text-[28px] font-black text-white mt-2">
                  412
                </h2>

              </div>

            </div>

            {/* ================= REFERRALS TABLE ================= */}

            <div className="space-y-4">

              <h2 className="text-[22px] font-black text-white tracking-tight">
                Your referrals this set
              </h2>

              <div className="w-full overflow-hidden rounded-[22px] border border-white/10 bg-[#22192D]">

                {/* Header */}

                <div className="grid grid-cols-[1.5fr_0.8fr_1.5fr_1fr] sm:grid-cols-[2.2fr_0.8fr_2.2fr_1fr] border-b border-white/10 px-4 sm:px-8 py-4 bg-white/[0.01]">

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Player
                  </p>

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 text-center">
                    Tickets
                  </p>

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Draws Entered
                  </p>

                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-right text-white/35">
                    Your Cut
                  </p>

                </div>

                {/* Rows */}

                {[
                  {
                    wallet: "0x91c4...8ab2",
                    tickets: 18,
                    draws: "all six",
                    cut: "$41.20",
                  },
                  {
                    wallet: "0x2d18...c73a",
                    tickets: 12,
                    draws: "jackpot, $5,000",
                    cut: "$27.50",
                  },
                  {
                    wallet: "0x77b9...041e",
                    tickets: 9,
                    draws: "$100, $1,000",
                    cut: "$20.60",
                  },
                  {
                    wallet: "0xf301...6b55",
                    tickets: 6,
                    draws: "jackpot",
                    cut: "$13.70",
                  },
                ].map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1.5fr_0.8fr_1.5fr_1fr] sm:grid-cols-[2.2fr_0.8fr_2.2fr_1fr] items-center border-b border-white/5 px-4 sm:px-8 py-4 sm:py-5 transition hover:bg-white/[0.02]"
                  >

                    <p className="font-mono text-sm sm:text-base text-white/80 truncate">
                      {row.wallet}
                    </p>

                    <p className="text-center text-sm sm:text-base font-semibold text-white/90">
                      {row.tickets}
                    </p>

                    <p className="text-sm sm:text-base text-white/60 truncate">
                      {row.draws}
                    </p>

                    <p className="text-right text-sm sm:text-base font-bold text-[#FF5DB1] whitespace-nowrap">
                      {row.cut}
                    </p>

                  </div>
                ))}

                {/* Centered footer text */}

                <div className="py-5 text-center">

                  <p className="text-xs font-semibold text-white/30 tracking-wide">
                    + 124 more players
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* ================= YOUR RANK ================= */}

            <div className="rounded-[22px] border border-white/10 bg-[#22192D] p-5 sm:p-8">

              <div className="flex items-start justify-between">

                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mt-1">
                  YOUR RANK THIS SET
                </p>

                <span className="text-[44px] font-black leading-none text-[#FF5DB1]">
                  #3
                </span>

              </div>

              {/* Progress Detail Rows */}

              <div className="mt-6 space-y-4">

                {/* Rank #2 Row */}

                <div className="flex items-center justify-between pl-4 relative">

                  <div className="absolute left-0 top-0.5 bottom-0.5 w-[3px] bg-white/10 rounded-full" />

                  <span className="text-[15px] font-medium text-white/60">
                    Rank #2 &middot; 508 tickets
                  </span>

                  <span className="text-[15px] font-semibold text-white/60">
                    +$96
                  </span>

                </div>

                {/* You Row */}

                <div className="flex items-center justify-between pl-4 relative">

                  <div className="absolute left-0 top-0.5 bottom-0.5 w-[3px] bg-[#FF5DB1] rounded-full" />

                  <span className="text-[15px] font-medium text-white">
                    You &middot; 412 tickets
                  </span>

                  <span className="text-[15px] font-bold text-[#FF5DB1]">
                    $284
                  </span>

                </div>

              </div>

              {/* Progress Bar */}

              <div className="mt-6">

                <div className="h-[7px] w-full overflow-hidden rounded-full bg-white/10">

                  <div className="h-full w-[81%] rounded-full bg-[#FF5DB1] transition-all duration-700" />

                </div>

              </div>

              {/* Description */}

              <p className="mt-4 text-[13px] leading-normal text-white/40 font-medium">
                96 more tickets and you take rank <span className="font-semibold text-white/60">#2</span> &mdash; worth about <span className="font-semibold text-white/60">+$140</span> when this set settles.
              </p>

            </div>

            {/* ================= REFERRAL POOL / SPLIT ================= */}

            <div className="rounded-[22px] border border-white/10 bg-[#22192D] p-5 sm:p-8">

              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                HOW THE 10% IS SPLIT
              </p>

              <div className="mt-6 space-y-4">

                <div className="flex items-center justify-between text-[15px] font-medium text-white/70">

                  <span>Rank #1</span>

                  <span>25% of pool</span>

                </div>

                <div className="flex items-center justify-between text-[15px] font-medium text-white/70">

                  <span>Rank #2</span>

                  <span>15%</span>

                </div>

                <div className="flex items-center justify-between text-[15px] font-bold text-[#FF5DB1]">

                  <span>Rank #3 &mdash; you</span>

                  <span>10%</span>

                </div>

                <div className="flex items-center justify-between text-[15px] font-medium text-white/70">

                  <span>Ranks #4&ndash;10</span>

                  <span>4% each</span>

                </div>

                <div className="flex items-center justify-between text-[15px] font-medium text-white/70">

                  <span>Everyone else</span>

                  <span>pro-rata</span>

                </div>

              </div>

              <p className="mt-8 text-xs leading-normal text-white/30 font-medium border-t border-white/5 pt-5">
                Paid automatically by the contract when the set settles at 00:00 UTC.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
