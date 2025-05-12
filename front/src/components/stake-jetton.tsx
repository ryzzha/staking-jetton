import { useTonAddress } from "@tonconnect/ui-react";
import { useState } from "react";


export const StakeJetton = () => {
    const walletAddress = useTonAddress();
    const [jettonAmount, setJettonAmount] = useState();

    const handleStake = async () => {
        if (!walletAddress) {
        alert("Please connect wallet");
            return;
        }

        if (!jettonAmount) {
            alert("Please enter an amount jettons to stake");
            return;
        }

       
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
              placeholder="Напр. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="staking-input"
            />
          </div>
    
          <button
            onClick={handleStake}
            disabled={loading || !amount}
            className="staking-button"
          >
            {loading ? 'Відправка...' : 'Стейкнути Jetton'}
          </button>
    
          {/* {message && ( */}
            // <p className="staking-message">{message}</p>
          {/* )} */}
    
          <div className="staking-footer">
            Твій гаманець: {userAddress ? userAddress : 'Не підключено'}
          </div>
        </div>
      );
}