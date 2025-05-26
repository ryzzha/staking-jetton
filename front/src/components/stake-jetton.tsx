import { useState } from "react";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTonApiClient } from "../hooks/useTonApiClient";
import { Address } from "@ton/core";
import "./stake-jetton.css"


export const StakeJetton = () => {
    const { wallet } = useTonConnect()
    const tonApiClient = useTonApiClient();
    const [jettonAmount, setJettonAmount] = useState("");
    const [loading, setLoading] = useState(false);


    const handleStake = async () => {
        if (!wallet) {
        alert("Please connect wallet");
            return;
        }

        if (!jettonAmount) {
            alert("Please enter an amount jettons to stake");
            return;
        }

        setLoading(true);

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
            // disabled={loading || !jettonAmount}
            className="staking-button"
          >
            {loading ? 'Відправка...' : 'Стейкнути Jetton'}
          </button>
    
          {/* {message && ( */}
            {/* // <p className="staking-message">{message}</p> */}
          {/* )} */}
    
          <div className="staking-footer">
            Твій гаманець: {wallet ? Address.parse(wallet).toString() : 'Не підключено'}
          </div>
        </div>
      );
}