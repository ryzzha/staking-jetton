import { useEffect, useState } from "react";
import { Address, fromNano } from "@ton/ton";
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
    if (!client) return;

    const initJettonMinter = async () => {
      let jettonMinter: OpenedContract<JettonMinter>;
      try {
        const contract = JettonMinter.createFromAddress(Address.parse(JETTON_MINTER_ADDRESS));
        jettonMinter = client.open(contract);
        setJettonMinter(jettonMinter);
      } catch (e) {
        console.error("❌ Error opening minter:", e);
        return;
      }
    };

    initJettonMinter();
  }, [client]);

  useEffect(() => {
    if (!client || !userWallet || !jettonMinter) return;

    const initJettonWallet = async () => {
      try {
        const walletAddr = await jettonMinter.getWalletAddress(Address.parse(userWallet));
        setJettonWalletAddress(walletAddr);

        const contract = JettonWallet.createFromAddress(walletAddr);
        const wallet = client.open(contract);
        setJettonWallet(wallet);

        const balance = await wallet.getJettonBalance();
        setJettonBalance(fromNano(balance));
        console.log(balance)
      } catch (e) {
        console.error("❌ Error working with wallet:", e);
      }
    };

    initJettonWallet();
  }, [client, userWallet, jettonMinter]);

  return {
    jettonMinter,
    jettonWallet,
    jettonWalletAddress,
    jettonBalance,
  };
}
