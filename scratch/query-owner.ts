import { createPublicClient, http } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "../config/contract";

async function main() {
    const client = createPublicClient({
        chain: mstTestnet,
        transport: http(),
    });

    try {
        const owner = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "owner",
        });
        console.log("Contract owner address:", owner);
    } catch (e) {
        console.error(e);
    }
}

main();
