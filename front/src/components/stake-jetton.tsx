import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { Address, beginCell, toNano, fromNano } from "@ton/core";
import "./stake-jetton.css"
import { useTonClient } from "../hooks/useTonClient";
// import { useStakingNFTs } from "../hooks/useStakingNFTs";
import { useJettonContracts } from "../hooks/useJettonContracts";
import { useStakingContract } from "../hooks/useStakingContract";


export const StakeJetton = () => {
    const { wallet, sender } = useTonConnect()
    const tonClient = useTonClient();
    const [jettonToStakeAmount, setJettonToStakeAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const { staking, stakingData, collectionData } = useStakingContract();
    const { jettonWallet, jettonWalletAddress, jettonBalance } = useJettonContracts(wallet);
    // const { nfts } = useStakingNFTs(wallet ? Address.parse(wallet).toString(): null)

    const handleStake = async () => {
        if (!jettonWallet) {
        alert("connect wallet");
            return;
        }

        if (!jettonToStakeAmount) {
            alert("enter an amount jettons to stake");
            return;
        }

        if (!tonClient) {
          alert("connection fail");
          return;
        }

        if (!staking) {
          alert("connection fail");
          return;
        }

        setLoading(true);

        // const appJettonWalletAddress = await staking.getJettonWalletAddress();

        // console.log("jetton wallet address to procces stake -> " + appJettonWalletAddress)

        await jettonWallet.sendTransfer(sender, {
          toAddress: Address.parse("kQBJnxNZL8gBhFKCA8biCJzAMHdFm29yKNppAjio_6Gq1ros".toString()),
            queryId: 0,
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano(jettonToStakeAmount),
            forwardPayload: beginCell()
                .storeUint(0x77b2286b, 32)
                .endCell(),
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
            <p>Твій жетон гаманець: {jettonWalletAddress ? Address.parse(jettonWalletAddress.toString()).toString() : 'Немає'}</p>
            <p>Твій баланс жетонів: {jettonBalance ? jettonBalance : 'Не підключено'}</p>
          </div>
        </div>
        <div className="staking-data">
          <h2>Інформація про стейкінг:</h2>

          {stakingData ? (
            <div className="staking-data-block">
              <p>📈 Річний відсоток: {(Number(stakingData.percentYear) / 10000000 * 100).toFixed(2)}%</p>
              <p>
                ⏳ Період блокування:{" "}
                {Math.floor(Number(stakingData.lockupPeriod) / 86400)} днів{" "}
                {Math.floor((Number(stakingData.lockupPeriod) % 86400) / 3600)} год.
              </p>
              <p>🎁 Всього нагород: {fromNano(stakingData.totalReward)}</p>
              <p>💰 Поточна нагорода: {fromNano(stakingData.currentReward)}</p>
            </div>
          ) : (
            <p>Завантаження даних стейкінгу...</p>
          )}

          {collectionData ? (
            <div className="staking-data-block">
              <h2>Колекція NFT</h2>
              <p>🆔 Наступний NFT індекс: {collectionData.nextItemIndex.toString()}</p>
              <p>👑 Власник колекції: {collectionData.owner.toString()}</p>
            </div>
          ) : (
            <p>Завантаження даних колекції...</p>
          )}
        </div>
        <div>
          {/* {loading ? (
            <p>Завантаження NFT...</p>
          ) : (
            nfts.map((nft, i) => <p key={i}>{nft}</p>)
          )} */}
        </div>
      </>
      );
}