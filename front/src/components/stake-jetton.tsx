import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Address, beginCell, toNano } from "@ton/core";
import "./stake-jetton.css"
import { useTonClient } from "../hooks/useTonClient";
import { JettonMinter } from "../contracts/JettonMinter";
import { JettonWallet } from "../contracts/JettonWallet";
import { useStakingNFTs } from "../hooks/useStakingNFTs";

const JETTON_MINTER_ADDRESS = "kQApBMzuNYZOxG7jZkgmM6k9bS-QQWAarRW1A5Hh1IxW0J_z"


export const StakeJetton = () => {
    const { wallet, sender } = useTonConnect()
    const tonClient = useTonClient();
    const [jettonAmount, setJettonAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const {  } = useStakingNFTs(Address.parse(wallet ?? "").toString(), Address.parse("").toString())


    const handleStake = async () => {
        if (!wallet) {
        alert("Please connect wallet");
            return;
        }

        if (!jettonAmount) {
            alert("Please enter an amount jettons to stake");
            return;
        }

        if (!tonClient) {
          alert("connection fail");
          return;
      }

        setLoading(true);

        const jettonMinter = tonClient.open(
          JettonMinter.createFromAddress(Address.parse(JETTON_MINTER_ADDRESS))
        );
        
        const jettonWalletAddress = await jettonMinter.getWalletAddress(Address.parse(wallet)); 

        const jettonWallet = tonClient.open(JettonWallet.createFromAddress(jettonWalletAddress));

        await jettonWallet.sendTransfer(sender, {
          toAddress: Address.parse(""),
          queryId: 1,
          jettonAmount: toNano(jettonAmount), 
          fwdAmount: toNano("0.05"),
          forwardPayload: beginCell().storeUint(0x736b, 32).endCell(), 
      });

        setLoading(false);
    }

    
    return (
        <div className="staking-container">
          <h1 className="staking-title">Staking Jettons</h1>
    
          <div className="staking-input-group">
            <label className="staking-label">
              Кількість Jetton для стейкінгу
            </label>
            <input
              type="number"
              placeholder="10"
              value={jettonAmount}
              onChange={(e) => setJettonAmount(e.target.value)}
              className="staking-input"
            />
          </div>
    
          <button
            onClick={handleStake}
            disabled={loading || !jettonAmount}
            className="staking-button"
          >
            {loading ? 'Відправка...' : 'Стейкнути Jetton'}
          </button>
    
          {/* {message && ( 
            <p className="staking-message">{message}</p>
          )} */}
    
          <div className="staking-footer">
            Твій гаманець: {wallet ? Address.parse(wallet).toString() : 'Не підключено'}
          </div>
        </div>
      );
}