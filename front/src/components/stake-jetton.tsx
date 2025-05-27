import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Address, beginCell, toNano } from "@ton/core";
import "./stake-jetton.css"
import { useTonClient } from "../hooks/useTonClient";
import { useStakingNFTs } from "../hooks/useStakingNFTs";
import { useJettonContracts } from "../hooks/useJettonContracts";


export const StakeJetton = () => {
    const { wallet, sender } = useTonConnect()
    const tonClient = useTonClient();
    const [jettonToStakeAmount, setJettonToStakeAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const { jettonWallet, jettonWalletAddress, jettonBalance } = useJettonContracts(wallet);
    const { nfts } = useStakingNFTs(wallet ? Address.parse(wallet).toString(): null, Address.parse("EQBbihvuS7lZ2i5xQNUOevBKoFgnwmpUWb9BRpRBTfWZfSXK").toString())


    const handleStake = async () => {
        if (!jettonWallet) {
        alert("Please connect wallet");
            return;
        }

        if (!jettonToStakeAmount) {
            alert("Please enter an amount jettons to stake");
            return;
        }

        if (!tonClient) {
          alert("connection fail");
          return;
      }

        setLoading(true);

        await jettonWallet.sendTransfer(sender, {
          toAddress: Address.parse(""),
          queryId: 1,
          jettonAmount: toNano(jettonToStakeAmount), 
          fwdAmount: toNano("0.05"),
          forwardPayload: beginCell().storeUint(0x736b, 32).endCell(), 
      });

        setLoading(false);
    }
    
    return (
      <>
        <div className="staking-container">
          <h1 className="staking-title">Staking Jettons</h1>
    
          <div className="staking-input-group">
            <label className="staking-label">
              Кількість Jetton для стейкінгу
            </label>
            <input
              type="number"
              placeholder="10"
              value={jettonToStakeAmount}
              onChange={(e) => setJettonToStakeAmount(e.target.value)}
              className="staking-input"
            />
          </div>
    
          <button
            onClick={handleStake}
            disabled={loading || !jettonToStakeAmount}
            className="staking-button"
          >
            {loading ? 'Відправка...' : 'Стейкнути Jetton'}
          </button>
    
          {/* {message && ( 
            <p className="staking-message">{message}</p>
          )} */}
    
          <div className="staking-footer">
            <p>Твій гаманець: {wallet ? Address.parse(wallet).toString() : 'Не підключено'}</p>
            <p>Твій баланс жетонів: {jettonBalance ? jettonBalance : 'Не підключено'}</p>
          </div>
        </div>
        <div>
          {loading ? (
            <p>Завантаження NFT...</p>
          ) : (
            nfts.map((nft, i) => <p key={i}>{nft}</p>)
          )}
        </div>
      </>
      );
}