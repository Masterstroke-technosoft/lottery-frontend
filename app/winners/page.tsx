import { Suspense } from "react";
import Winners from "@/components/lottery/winners/page";

export default function WinnersPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center bg-[#141019]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9F24A] border-t-transparent" />
            </div>
        }>
            <Winners />
        </Suspense>
    );
}
