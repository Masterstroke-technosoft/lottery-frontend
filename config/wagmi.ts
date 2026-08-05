import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { mstTestnet } from "./contract";

export const config = createConfig({
    chains: [mstTestnet],

    transports: {
        [mstTestnet.id]: http(),
    },

    connectors: [
        injected(),
    ],
});