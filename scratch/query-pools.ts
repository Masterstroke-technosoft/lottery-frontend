import { createPublicClient, http } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "../config/contract";

async function main() {
    const client = createPublicClient({
        chain: mstTestnet,
        transport: http(),
    });

    try {
        const roundId = BigInt(138);
        const drawType = 0; // Lucky One

        const [status, partCount, winners, prizeAmounts] = await Promise.all([
            client.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getRoundStatus",
                args: [roundId, drawType],
            }),
            client.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getParticipantCount",
                args: [roundId, drawType],
            }),
            client.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getWinners",
                args: [roundId, drawType],
            }),
            client.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getPrizeAmounts",
                args: [roundId, drawType],
            }),
        ]);

        console.log(`Round 138 status: ${status}`);
        console.log(`Round 138 participantCount: ${partCount}`);
        console.log(`Round 138 winners:`, winners);
        console.log(`Round 138 prizeAmounts:`, prizeAmounts);
    } catch (e) {
        console.error("Error querying round 138:", e);
    }
}

main();
