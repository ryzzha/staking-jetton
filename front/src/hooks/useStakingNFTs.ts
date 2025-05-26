import { Address, Cell, Slice } from "@ton/core";
import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";

export function useStakingNFTs(userAddress: string | null, collectionAddress: string) {
    const client = useTonClient();
    const [nfts, setNfts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!client || !userAddress) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const result: string[] = [];

                for (let i = 0; i < 100; i++) {
                    const nftItemAddress = await getNftItemAddress(collectionAddress, i, client);

                    const contractState = await client.getContractState(nftItemAddress);
                    if (contractState.state !== "active" || !contractState.data) return;
                      

                    const cell = Cell.fromBoc(contractState.data)[0];
                    const slice = cell.beginParse();
                    const owner = slice.loadAddress().toString();

                    if (owner === userAddress) {
                        result.push(nftItemAddress.toString());
                    }
                }

                setNfts(result);
            } catch (err) {
                console.error("NFT error", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [client, userAddress, collectionAddress]);

    return { nfts, loading };
}

async function getNftItemAddress(collection: string, index: number, client: any) {
    const res = await client.runMethod(Address.parse(collection), "get_nft_address_by_index", [
        { type: "int", value: BigInt(index) },
    ]);
    return res.stack.readAddress();
}
