"use client";

import { useEffect, useState } from "react";

interface DrawCard {
  id: string;
  amount: string;
  ticketsCount: number;
  ticketCodes: string[];
  totalPoolTickets: number;
  isJackpot?: boolean;
}

export default function TicketPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 33,
    seconds: 17,
  });

  const [draws, setDraws] = useState<DrawCard[]>([
    {
      id: "draw-100",
      amount: "$100",
      ticketsCount: 3,
      ticketCodes: ["#418-WU-0112", "#418-WU-0113", "#418-WU-0114"],
      totalPoolTickets: 1284,
    },
    {
      id: "draw-1000",
      amount: "$1,000",
      ticketsCount: 1,
      ticketCodes: ["#418-DG-0387"],
      totalPoolTickets: 906,
    },
    {
      id: "draw-4500",
      amount: "$4,500",
      ticketsCount: 2,
      ticketCodes: ["#418-HF-0201", "#418-HF-0202"],
      totalPoolTickets: 512,
    },
    {
      id: "draw-10000",
      amount: "$10,000",
      ticketsCount: 1,
      ticketCodes: ["#418-JP-0442"],
      totalPoolTickets: 681,
      isJackpot: true,
    },
    {
      id: "draw-2000",
      amount: "$2,000",
      ticketsCount: 0,
      ticketCodes: [],
      totalPoolTickets: 852,
    },
    {
      id: "draw-5000",
      amount: "$5,000",
      ticketsCount: 0,
      ticketCodes: [],
      totalPoolTickets: 720,
    },
  ]);

  // Countdown timer effect
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

  const totalTickets = draws.reduce((acc, draw) => acc + draw.ticketsCount, 0);
  const activeDrawsCount = draws.filter((draw) => draw.ticketsCount > 0).length;
  const totalSpent = totalTickets * 2; // 2 USDC per ticket

  const enterDraw = (drawId: string) => {
    setDraws((prevDraws) =>
      prevDraws.map((draw) => {
        if (draw.id === drawId) {
          const suffix = Math.floor(Math.random() * 9000) + 1000;
          const codePrefix = draw.isJackpot ? "JP" : "WU";
          const newCode = `#418-${codePrefix}-${suffix}`;
          return {
            ...draw,
            ticketsCount: draw.ticketsCount + 1,
            ticketCodes: [...draw.ticketCodes, newCode],
            totalPoolTickets: draw.totalPoolTickets + 1,
          };
        }
        return draw;
      })
    );
  };

  const coverRemainingDraws = () => {
    setDraws((prevDraws) =>
      prevDraws.map((draw) => {
        if (draw.ticketsCount === 0) {
          const suffix = Math.floor(Math.random() * 9000) + 1000;
          const newCode = `#418-WU-${suffix}`;
          return {
            ...draw,
            ticketsCount: 1,
            ticketCodes: [newCode],
            totalPoolTickets: draw.totalPoolTickets + 1,
          };
        }
        return draw;
      })
    );
  };

  const unenteredDraws = draws.filter((draw) => draw.ticketsCount === 0);

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-10 pt-10 sm:pt-16 pb-10 sm:pb-12 text-white">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#C9F24A]">
              SET #418
            </span>
            <span className="text-white/30">&bull;</span>
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#C9F24A]">
              IN PLAY
            </span>
          </div>

          <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            {totalTickets} tickets across {activeDrawsCount} draws
          </h2>

          <p className="mt-2.5 text-[14px] sm:text-[15px] font-medium text-white/45">
            Spent {totalSpent} USDC &bull; potential winnings up to $16,600 &bull; draws settle in{" "}
            <span className="font-mono font-bold text-white/80">
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </p>
        </div>

        {/* Action Button */}
        {unenteredDraws.length > 0 && (
          <button
            onClick={coverRemainingDraws}
            className="w-full md:w-auto rounded-xl bg-[#C9F24A] hover:bg-[#D9FF67] px-6 py-4 text-sm font-bold text-[#0E0B13] shadow-[0_0_20px_rgba(201,242,74,0.15)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-center"
          >
            Cover the last {unenteredDraws.length} draws &bull; {unenteredDraws.length * 2} USDC
          </button>
        )}
      </div>

      {/* ================= CARDS GRID ================= */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draws.map((draw) => {
          const isEntered = draw.ticketsCount > 0;

          if (isEntered) {
            // Entered state card
            let cardBgBorder = "bg-[#22192D] border-white/10";
            let amountTextClass = "text-2xl font-black text-white";
            let badgeBgClass = "bg-white/[0.04] text-white/70";

            if (draw.isJackpot) {
              cardBgBorder = "bg-[#231A16] border-[#E8B854]/30";
              amountTextClass = "text-2xl font-black text-[#E8B854]";
              badgeBgClass = "bg-[#E8B854]/10 border border-[#E8B854]/25 text-[#E8B854]";
            }

            return (
              <div
                key={draw.id}
                className={`rounded-[22px] border p-5 sm:p-6 flex flex-col justify-between min-h-[210px] h-auto transition duration-300 hover:border-white/20 ${cardBgBorder}`}
              >
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <span className={amountTextClass}>{draw.amount}</span>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-[#C9F24A]">
                    {draw.ticketsCount} {draw.ticketsCount === 1 ? "TICKET" : "TICKETS"}
                  </span>
                </div>

                {/* Ticket Badges */}
                <div className="flex flex-wrap gap-2 mt-4 mb-4">
                  {draw.ticketCodes.map((code, index) => (
                    <span
                      key={index}
                      className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-bold tracking-wider ${badgeBgClass}`}
                    >
                      {code}
                    </span>
                  ))}
                </div>

                {/* Footer Odds */}
                <div className="mt-auto pt-4 text-xs font-semibold text-white/40 border-t border-white/5">
                  Odds {draw.ticketsCount} in {draw.totalPoolTickets.toLocaleString()} &bull; via{" "}
                  <span className="text-[#FF5DB1] font-bold">MOONBOY</span>
                </div>
              </div>
            );
          } else {
            // Unentered state card
            return (
              <div
                key={draw.id}
                className="rounded-[22px] border border-white/[0.07] bg-[#141019]/60 p-5 sm:p-6 flex flex-col justify-between min-h-[210px] h-auto transition duration-300 hover:border-white/15"
              >
                <div>
                  <span className="text-2xl font-black text-white/30">{draw.amount}</span>
                  <p className="mt-2 text-sm font-medium text-white/30">Not entered yet</p>
                </div>

                <button
                  onClick={() => enterDraw(draw.id)}
                  className="w-full mt-4 rounded-xl border border-[#C9F24A]/20 bg-[#C9F24A]/5 hover:bg-[#C9F24A]/10 py-3.5 text-xs font-bold text-[#C9F24A] hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
                >
                  Enter &bull; 2 USDC
                </button>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
