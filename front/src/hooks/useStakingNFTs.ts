// import { Address, Cell } from "@ton/core";
// import { useEffect, useState } from "react";
// import { useTonClient } from "./useTonClient";



// export function useStakingNFTs(userAddress: string | null) {
//   const client = useTonClient();
//   const [nfts, setNfts] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!client || !userAddress || !collectionAddress) return;

//     const fetchNFTs = async () => {
//       setLoading(true);
//       const result: string[] = [];

//       try {
//         for (let i = 0; i < 100; i++) {
//           let nftItemAddress: Address;

//           try {
//             nftItemAddress = await getNftItemAddress(collectionAddress, i, client);
//           } catch {
//             continue;
//           }

//           try {
//             const contractState = await client.getContractState(nftItemAddress);
//             if (contractState.state !== "active" || !contractState.data) continue;

//             const cell = Cell.fromBoc(contractState.data)[0];
//             const slice = cell.beginParse();
//             const owner = slice.loadAddress();

//             if (owner.toString() === userAddress) {
//               result.push(nftItemAddress.toString());
//             }
//           } catch {
//             continue;
//           }
//         }

//         setNfts(result);
//       } catch (err) {
//         console.error("❌ Error loading NFTs:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNFTs();
//   }, [client, userAddress, collectionAddress]);

//   return { nfts, loading };
// }

// async function getNftItemAddress(collection: string, index: number, client: any): Promise<Address> {
//   const res = await client.runMethod(Address.parse(collection), "get_nft_address_by_index", [
//     { type: "int", value: BigInt(index) },
//   ]);
//   return res.stack.readAddress();
// }
