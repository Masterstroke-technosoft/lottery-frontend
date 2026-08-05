"use client";

// import Hero from "@/components/lottery/hero/page";
import LotteryCards from "@/components/lottery/lotteryCards/page";
import Jackpot from "@/components/lottery/jackpot/page";
import ConnectWallet from "@/components/lottery/connectwallet/page";
import Winners from "@/components/lottery/winners/page";
import Referral from "@/components/lottery/referral/page";
import LeaderboardPage from "@/components/lottery/leaderboard/page";
import HistoryPage from "@/components/lottery/history/page";
import TicketPage from "@/components/lottery/ticket/page";
import ConnectWalletModal from "@/components/lottery/connectwallet/ConnectWalletModal";
// import ContractInfoTest from "@/components/lottery/winners/ContractInfoTest";

export default function LotteryPage() {
    return (
        <main className="min-h-screen bg-[#17121F]">
            {/* <Hero /> */}
            <LotteryCards />
            {/* <ContractInfoTest /> */}
            {/* <ConnectWallet /> */}
            {/* <Winners /> */}
            {/* <Referral /> */}
            {/* <LeaderboardPage /> */}
            {/* <HistoryPage /> */}
            {/* <TicketPage /> */}

        </main>
    );
}