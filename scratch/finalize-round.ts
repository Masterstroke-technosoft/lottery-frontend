import { createWalletClient, createPublicClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESS, CONTRACT_ABI, mstTestnet } from "../config/contract";

async function main() {
    const privateKey = process.env.OWNER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
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

    try {
        console.log("Calling finalizeDraw(138, 0)...");
        const txHash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "finalizeDraw",
            args: [BigInt(138), 0],
        });
        console.log("Tx Hash:", txHash);

        console.log("Waiting for confirmation...");
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        console.log("Confirmed in block:", receipt.blockNumber.toString());
    } catch (e) {
        console.error("Finalization failed:", e);
    }
}

main();
