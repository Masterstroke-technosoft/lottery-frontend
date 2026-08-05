import BrowserWalletCard from "./BrowserWalletCard";

interface Props {
    onClose: () => void;
}

export default function ConnectWalletModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-[520px] rounded-3xl bg-[#17131F] p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Connect Wallet
                    </h2>

                    <button onClick={onClose}>Close</button>
                </div>

                <BrowserWalletCard onClose={onClose} />
            </div>
        </div>
    );
}