// "use client";

// import { useEffect, useState } from "react";

// export default function Hero() {
//     const [time, setTime] = useState({
//         hh: "18",
//         mm: "42",
//         ss: "09",
//     });

//     useEffect(() => {
//         const update = () => {
//             const now = new Date();

//             const next = new Date();

//             next.setUTCHours(24, 0, 0, 0);

//             const diff = next.getTime() - now.getTime();

//             const hours = Math.floor(diff / (1000 * 60 * 60));

//             const minutes = Math.floor(
//                 (diff % (1000 * 60 * 60)) / (1000 * 60)
//             );

//             const seconds = Math.floor(
//                 (diff % (1000 * 60)) / 1000
//             );

//             setTime({
//                 hh: String(hours).padStart(2, "0"),
//                 mm: String(minutes).padStart(2, "0"),
//                 ss: String(seconds).padStart(2, "0"),
//             });
//         };

//         update();

//         const interval = setInterval(update, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <section
//             className="
//       border-b border-white/[0.07]
//       bg-[radial-gradient(circle_at_12%_0%,rgba(201,242,74,.10),rgba(255,93,177,.06)_42%,transparent_72%)]
//       "
//         >
//             <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_340px] gap-12 px-10 pb-10 pt-11">

//                 {/* LEFT */}

//                 <div>

//                     <div className="mb-4 flex items-center gap-3">

//                         <span
//                             className="
//               font-mono
//               text-[11px]
//               font-semibold
//               tracking-[0.16em]
//               text-[#C9F24A]
//               "
//                         >
//                             ALL SIX DRAWS CLOSE IN
//                         </span>

//                         <span
//                             className="
//               font-mono
//               text-[11px]
//               text-white/40
//               "
//                         >
//                             • resets 00:00 UTC
//                         </span>

//                     </div>

//                     {/* Countdown */}

//                     <div className="flex items-end gap-4">

//                         <TimeBox
//                             value={time.hh}
//                             label="HRS"
//                             color="text-white"
//                         />

//                         <Colon />

//                         <TimeBox
//                             value={time.mm}
//                             label="MIN"
//                             color="text-white"
//                         />

//                         <Colon />

//                         <TimeBox
//                             value={time.ss}
//                             label="SEC"
//                             color="text-[#C9F24A]"
//                             labelColor="text-[#C9F24A]/70"
//                         />

//                     </div>

//                     <p
//                         className="
//             mt-6
//             max-w-[520px]
//             text-[15px]
//             leading-7
//             text-white/60
//             "
//                     >
//                         Six prize pools, six winners, every single day.

//                         One flat{" "}

//                         <span className="font-semibold text-white">
//                             2 USDC
//                         </span>

//                         {" "}ticket gets you into any draw —
//                         enter as many as you like before
//                         the clock hits zero.
//                     </p>

//                 </div>

//                 {/* RIGHT */}

//                 <div
//                     className="
//           rounded-[14px]
//           border
//           border-white/10
//           bg-white/[0.035]
//           p-5
//           "
//                 >

//                     <div className="flex items-end justify-between">

//                         <span
//                             className="
//               font-mono
//               text-[11px]
//               font-semibold
//               tracking-[0.12em]
//               text-white/50
//               "
//                         >
//                             TODAY'S POOL
//                         </span>

//                         <span
//                             className="
//               font-['Bricolage_Grotesque']
//               text-[20px]
//               font-bold
//               text-white
//               "
//                         >
//                             $28,340
//                         </span>

//                     </div>

//                     {/* Progress */}

//                     <div className="mt-5 flex h-[9px] overflow-hidden rounded-full">

//                         <div className="w-[80%] bg-[#C9F24A]" />

//                         <div className="w-[10%] bg-[#FF5DB1]" />

//                         <div className="w-[10%] bg-white/20" />

//                     </div>

//                     <div className="mt-6 space-y-3">

//                         <PoolItem
//                             color="bg-[#C9F24A]"
//                             text="80% to winners"
//                         />

//                         <PoolItem
//                             color="bg-[#FF5DB1]"
//                             text="10% to referrers"
//                         />

//                         <PoolItem
//                             color="bg-white/20"
//                             text="10% protocol"
//                         />

//                     </div>

//                     <p
//                         className="
//             mt-5
//             font-mono
//             text-[11px]
//             text-white/35
//             "
//                     >
//                         Split enforced on-chain ·{" "}

//                         <a
//                             href="#"
//                             className="text-[#C9F24A]"
//                         >
//                             view contract
//                         </a>

//                     </p>

//                 </div>

//             </div>
//         </section>
//     );
// }

// function Colon() {
//     return (
//         <span
//             className="
//       mb-6
//       font-['Bricolage_Grotesque']
//       text-[84px]
//       font-extrabold
//       text-[#C9F24A]/50
//       "
//         >
//             :
//         </span>
//     );
// }

// function TimeBox({
//     value,
//     label,
//     color,
//     labelColor,
// }: {
//     value: string;
//     label: string;
//     color: string;
//     labelColor?: string;
// }) {
//     return (
//         <div className="flex flex-col items-center gap-1">

//             <span
//                 className={`
//         font-['Bricolage_Grotesque']
//         text-[104px]
//         font-extrabold
//         leading-none
//         tracking-[-0.045em]
//         ${color}
//         `}
//             >
//                 {value}
//             </span>

//             <span
//                 className={`
//         font-mono
//         text-[10px]
//         tracking-[0.2em]
//         ${labelColor ?? "text-white/40"}
//         `}
//             >
//                 {label}
//             </span>

//         </div>
//     );
// }

// function PoolItem({
//     color,
//     text,
// }: {
//     color: string;
//     text: string;
// }) {
//     return (
//         <div className="flex items-center gap-2">

//             <span
//                 className={`h-2 w-2 rounded-sm ${color}`}
//             />

//             <span className="text-[12.5px] text-white/80">
//                 {text}
//             </span>

//         </div>
//     );
// }