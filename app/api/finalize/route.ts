import { NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "@/config/contract";

export async function POST(req: Request) {
    try {
        const privateKey = process.env.OWNER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        if (!privateKey) {
            return NextResponse.json({ error: "OWNER_PRIVATE_KEY environment variable is not configured" }, { status: 500 });
        }

        const account = privateKeyToAccount(privateKey as Hex);
        
        const publicClient = createPublicClient({
            chain: mstTestnet,
            transport: http(),
        });

        const walletClient = createWalletClient({
            account,
            chain: mstTestnet,
            transport: http(),
        });

        // 1. Fetch pools info from contract
        const pools = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getAllPoolsInfo",
        }) as any[];

        const finalizedPools = [];

        // 2. Scan and finalize expired pools
        for (const pool of pools) {
            const drawType = Number(pool.drawType);
            const currentRound = Number(pool.currentRound);
            const remainingTime = Number(pool.remainingTime);
            const isOpen = pool.isOpen;

            if (remainingTime <= 0 && isOpen) {
                console.log(`Finalizing drawType ${drawType}, round ${currentRound} via owner backend...`);
                
                // Call finalizeDraw(roundId, drawType)
                const txHash = await walletClient.writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: "finalizeDraw",
                    args: [BigInt(currentRound), drawType],
                });

                // Wait for transaction receipt
                await publicClient.waitForTransactionReceipt({ hash: txHash });
                finalizedPools.push({ drawType, roundId: currentRound, txHash });
            }
        }

        return NextResponse.json({ success: true, finalizedPools });
    } catch (err: any) {
        console.error("Backend finalization error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
