import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useEffect } from "react";
import { Address } from "@ton/core";
import type { Sender, SenderArguments } from "@ton/core";

interface ITonConnectData {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: CHAIN | null;
}

export function useTonConnect(): ITonConnectData {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet()

    useEffect(() => {
        console.log("render nav")
        console.log("connected address -> ", wallet?.account?.address);
        console.log("tonConnectUI account chain -> ", tonConnectUI.account?.chain);
    }, [wallet]);

    return {
        sender: {
            send: async (args: SenderArguments) => {
              tonConnectUI.sendTransaction({
                messages: [
                  {
                    address: args.to.toString(),
                    amount: args.value.toString(),
                    payload: args.body?.toBoc().toString("base64"),
                  },
                ],
                validUntil: Date.now() + 5 * 60 * 1000, 
              });
            },
            address: wallet?.account?.address ? Address.parse(wallet?.account?.address as string) : undefined
          }, 
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null
    }
}