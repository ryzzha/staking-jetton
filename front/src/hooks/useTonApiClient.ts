import { TonApiClient } from '@ton-api/client';
import { useEffect, useState } from 'react';
import { useTonConnect } from './useTonConnect';
import { CHAIN } from "@tonconnect/ui-react";

export const useTonApiClient = () => {
    const [tonApiClient, setTonApiClient] = useState<TonApiClient | null>(null);
    const { network } = useTonConnect();

    useEffect(() => {   
        if (!network) return;
        const tonApiPath = network == CHAIN.MAINNET ? "" : "testnet.";
        const client = new TonApiClient({
            baseUrl: `https://${tonApiPath}tonapi.io`,
          })
        setTonApiClient(client);
    }, [network])

    console.log(tonApiClient);

    return tonApiClient;
 }
