import { useEffect, useState } from "react";
import { Address, fromNano } from "@ton/core";
import type { OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { JettonMinter } from "../contracts/JettonMinter";
import { JettonWallet } from "../contracts/JettonWallet";

const JETTON_MINTER_ADDRESS = "kQApBMzuNYZOxG7jZkgmM6k9bS-QQWAarRW1A5Hh1IxW0J_z";

export function useJettonContracts(userWallet: string | null) {
  const client = useTonClient();
  const [jettonMinter, setJettonMinter] = useState<OpenedContract<JettonMinter> | null>(null);
  const [jettonWallet, setJettonWallet] = useState<OpenedContract<JettonWallet> | null>(null);
  const [jettonWalletAddress, setJettonWalletAddress] = useState<Address | null>(null);
  const [jettonBalance, setJettonBalance] = useState<string>("");

  useEffect(() => {
    if (!client || !userWallet) return;

    const init = async () => {
      // console.log("useJettonContracts init", userWallet);
      console.log(client); 


      const minterAddr = safeParseAddress(JETTON_MINTER_ADDRESS);
      const userAddr = safeParseAddress(userWallet);
      if (!userAddr || !minterAddr) {
        console.error("❌ Failed to parse userWallet:", userWallet);
        return;
      }

      const state = await client.getContractState(minterAddr);
console.log("🔍 Jetton minter state:", state);

      let minter: OpenedContract<JettonMinter>;
      try {
        console.log("Opening Jetton Minter at address:", JETTON_MINTER_ADDRESS);
        console.log("Opening Jetton Minter at address after parse:", minterAddr);
        minter = client.open(JettonMinter.createFromAddress(Address.parse(JETTON_MINTER_ADDRESS)));
        setJettonMinter(minter);
      } catch (e) {
        console.error("❌ Error opening minter:", e);
        return;
      }

      try {
        const walletAddr = await minter.getWalletAddress(userAddr);
        setJettonWalletAddress(walletAddr);

        const wallet = client.open(JettonWallet.createFromAddress(walletAddr));
        setJettonWallet(wallet);

        const balance = await wallet.getJettonBalance();
        setJettonBalance(fromNano(balance));
      } catch (e) {
        console.error("❌ Error working with wallet:", e);
      }
    };

    init();
  }, [client, userWallet]);

  return {
    jettonMinter,
    jettonWallet,
    jettonWalletAddress,
    jettonBalance,
  };
}

function safeParseAddress(addr: string | null): Address | null {
  try {
    if (!addr || addr.length < 48) return null;

    if (addr.includes(':')) return Address.parseRaw(addr); 
    return Address.parse(addr); 
  } catch {
    return null;
  }
}

