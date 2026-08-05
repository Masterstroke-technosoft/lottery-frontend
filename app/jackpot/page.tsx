import { Suspense } from "react";
import Jackpot from "@/components/lottery/jackpot/page";

export default function JackpotPage() {
    return (
        <main className="mx-auto max-w-[1440px] px-10 py-12">
            <Suspense fallback={
                <div className="flex h-[50vh] items-center justify-center bg-[#17121F]">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9F24A] border-t-transparent" />
                </div>
            }>
                <Jackpot />
            </Suspense>
        </main>
    );
}