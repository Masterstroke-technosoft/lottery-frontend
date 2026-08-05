// "use client";

// import { useReadContract, useBalance } from "wagmi";
// import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
// import { formatEther } from "viem";
// import { RefreshCw, Shield, User, Wallet, Award, Coins } from "lucide-react";

// export default function ContractInfoTest() {
//     // 1. Fetch Current Round
//     const {
//         data: currentRound,
//         error: roundError,
//         isPending: roundPending,
//         refetch: refetchRound
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "getCurrentRound",
//     });

//     // 2. Fetch Tickets Sold
//     const {
//         data: ticketsSold,
//         error: ticketsError,
//         isPending: ticketsPending,
//         refetch: refetchTickets
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "totalTicketsSold",
//     });

//     // 3. Fetch Prizes Distributed
//     const {
//         data: prizesDistributed,
//         error: prizesError,
//         isPending: prizesPending,
//         refetch: refetchPrizes
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "totalPrizeDistributed",
//     });

//     // 4. Fetch Referral Rewards Distributed
//     const {
//         data: referralRewards,
//         error: referralError,
//         isPending: referralPending,
//         refetch: refetchReferral
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "totalReferralRewardsDistributed",
//     });

//     // 5. Fetch Latest Completed Round
//     const {
//         data: latestCompletedRound,
//         error: completedRoundError,
//         isPending: completedRoundPending,
//         refetch: refetchCompletedRound
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "lastFinalizedRound",
//     });

//     // 6. Fetch Contract Balance using useBalance hook (more robust)
//     const {
//         data: balanceData,
//         error: balanceError,
//         isPending: balancePending,
//         refetch: refetchBalance
//     } = useBalance({
//         address: CONTRACT_ADDRESS,
//     });

//     // 7. Fetch Owner
//     const {
//         data: ownerAddress,
//         error: ownerError,
//         isPending: ownerPending,
//         refetch: refetchOwner
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "owner",
//     });

//     // 8. Fetch Finalizer
//     const {
//         data: finalizerAddress,
//         error: finalizerError,
//         isPending: finalizerPending,
//         refetch: refetchFinalizer
//     } = useReadContract({
//         address: CONTRACT_ADDRESS,
//         abi: CONTRACT_ABI,
//         functionName: "finalizer",
//     });

//     const handleRefreshAll = () => {
//         refetchRound();
//         refetchTickets();
//         refetchPrizes();
//         refetchReferral();
//         refetchCompletedRound();
//         refetchBalance();
//         refetchOwner();
//         refetchFinalizer();
//     };

//     const isAnyPending =
//         roundPending ||
//         ticketsPending ||
//         prizesPending ||
//         referralPending ||
//         completedRoundPending ||
//         balancePending ||
//         ownerPending ||
//         finalizerPending;

//     return (
//         <section className="bg-[#17121F] py-8 border-t border-white/5">
//             <div className="mx-auto max-w-7xl px-8">
//                 <div className="rounded-3xl border border-white/10 bg-[#1C1725] p-8">

//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-8">
//                         <div>
//                             <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C9F24A]">
//                                 Contract Testing
//                             </span>
//                             <h2 className="mt-2 text-2xl font-extrabold text-white">
//                                 Contract Info Dashboard
//                             </h2>
//                         </div>
//                         <button
//                             onClick={handleRefreshAll}
//                             className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 cursor-pointer animate-none"
//                         >
//                             <RefreshCw size={16} className={isAnyPending ? "animate-spin" : ""} />
//                             Refresh All
//                         </button>
//                     </div>

//                     {/* Grid Layout */}
//                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

//                         {/* Current Round */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Award size={18} className="text-[#C9F24A]" />
//                                 <span className="text-sm font-medium">Current Round</span>
//                             </div>
//                             <p className="mt-3 text-3xl font-bold text-white">
//                                 {currentRound !== undefined ? currentRound.toString() : roundPending ? "Loading..." : "0"}
//                             </p>
//                         </div>

//                         {/* Tickets Sold */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Coins size={18} className="text-[#FF5DB1]" />
//                                 <span className="text-sm font-medium">Tickets Sold</span>
//                             </div>
//                             <p className="mt-3 text-3xl font-bold text-white">
//                                 {ticketsSold !== undefined ? ticketsSold.toString() : ticketsPending ? "Loading..." : "0"}
//                             </p>
//                         </div>

//                         {/* Prizes Distributed */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Coins size={18} className="text-[#67E8F9]" />
//                                 <span className="text-sm font-medium">Prizes Distributed</span>
//                             </div>
//                             <p className="mt-3 text-2xl font-bold text-white truncate" title={prizesDistributed !== undefined ? `${formatEther(prizesDistributed)} tMSTC` : ""}>
//                                 {prizesDistributed !== undefined ? `${parseFloat(formatEther(prizesDistributed)).toFixed(4)} tMSTC` : prizesPending ? "Loading..." : "0 tMSTC"}
//                             </p>
//                         </div>

//                         {/* Referral Rewards */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Coins size={18} className="text-[#FACC15]" />
//                                 <span className="text-sm font-medium">Referral Rewards</span>
//                             </div>
//                             <p className="mt-3 text-2xl font-bold text-white truncate" title={referralRewards !== undefined ? `${formatEther(referralRewards)} tMSTC` : ""}>
//                                 {referralRewards !== undefined ? `${parseFloat(formatEther(referralRewards)).toFixed(4)} tMSTC` : referralPending ? "Loading..." : "0 tMSTC"}
//                             </p>
//                         </div>

//                         {/* Latest Completed Round */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Award size={18} className="text-[#A78BFA]" />
//                                 <span className="text-sm font-medium">Latest Completed Round</span>
//                             </div>
//                             <p className="mt-3 text-3xl font-bold text-white">
//                                 {latestCompletedRound !== undefined ? latestCompletedRound.toString() : completedRoundPending ? "Loading..." : "0"}
//                             </p>
//                         </div>

//                         {/* Contract Balance */}
//                         <div className="rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="flex items-center gap-3 text-zinc-400">
//                                 <Wallet size={18} className="text-[#FB923C]" />
//                                 <span className="text-sm font-medium">Contract Balance</span>
//                             </div>
//                             <p className="mt-3 text-2xl font-bold text-white truncate" title={balanceData ? `${formatEther(balanceData.value)} ${balanceData.symbol}` : ""}>
//                                 {balanceData ? `${parseFloat(formatEther(balanceData.value)).toFixed(4)} ${balanceData.symbol}` : balancePending ? "Loading..." : "0 tMSTC"}
//                             </p>
//                         </div>

//                         {/* Owner & Finalizer Addresses */}
//                         <div className="col-span-1 sm:col-span-2 rounded-2xl border border-white/5 bg-[#141019] p-5">
//                             <div className="space-y-4">
//                                 <div>
//                                     <div className="flex items-center gap-3 text-zinc-400">
//                                         <Shield size={18} className="text-blue-400" />
//                                         <span className="text-sm font-medium">Owner Address</span>
//                                     </div>
//                                     <p className="mt-1 font-mono text-xs text-zinc-300 break-all select-all">
//                                         {ownerAddress || (ownerPending ? "Loading..." : "N/A")}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <div className="flex items-center gap-3 text-zinc-400">
//                                         <User size={18} className="text-purple-400" />
//                                         <span className="text-sm font-medium">Finalizer Address</span>
//                                     </div>
//                                     <p className="mt-1 font-mono text-xs text-zinc-300 break-all select-all">
//                                         {finalizerAddress || (finalizerPending ? "Loading..." : "N/A")}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                     </div>

//                 </div>
//             </div>
//         </section>
//     );
// }