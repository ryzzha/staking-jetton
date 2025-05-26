import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import { useEffect, useState } from "react";

export function useTonClient() {
  const [client, setClient] = useState<TonClient | null>(null);

  useEffect(() => {
    const init = async () => {
      const endpoint = await getHttpEndpoint({ network: "testnet" });
      const client = new TonClient({ endpoint });
      setClient(client);
    };
    init();
  }, []);

  return client;
}
