
import { useStakingNFTs } from "../hooks/useStakingNFTs";
import { useTonConnect } from "../hooks/useTonConnect";

const STAKING_ADDRESS = "kQBJnxNZL8gBhFKCA8biCJzAMHdFm29yKNppAjio_6Gq1ros";

export const UserNFTs = () => {
    const { wallet } = useTonConnect();
    const { nfts, loading } = useStakingNFTs(wallet);

    if (!wallet) return <p>Гаманець не підключено</p>;
    if (loading) return <p>Завантаження NFT...</p>;

    return (
        <div className="nft-grid">
            {nfts.length === 0 && <p>У тебе ще немає NFT 😔</p>}
            {nfts.map((nft) => (
                <div key={nft.address} className="nft-card">
                    <img src={nft.previews?.[0]?.url || "/default-nft.png"} alt={nft.metadata?.name || "NFT"} />
                    <h3>{nft.metadata?.name}</h3>
                    <p>{nft.metadata?.description}</p>
                </div>
            ))}
        </div>
    );
};
