// import { useEffect, useState } from "react";
// import { Address, Dictionary, Slice } from "@ton/core";
// import {useTonApiClient} from "./useTonApiClient"


// export function useJettonInfo(minterAddress: string) {
//     const client = useTonApiClient();
//     const [meta, setMeta] = useState<{
//         name?: string;
//         symbol?: string;
//         image?: string;
//         decimals?: number;
//     }>({});

//     if(client == null) {
//         return;
//     }

//     useEffect(() => {
//         const fetchMetadata = async () => {
//             const address = Address.parse(minterAddress);
//             const jettonSC = await 


//             const contentCell = Slice.parse(res.state!.data!);
//             contentCell.loadUint(8); // skip type

//             const dictSlice = contentCell.loadRef();
//             const dict = Dictionary.loadDirect(
//                 Dictionary.Keys.Buffer(64),
//                 Dictionary.Values.Cell(),
//                 dictSlice
//             );

//             const parseText = (key: string) =>
//                 dict.get(Buffer.from(key))?.beginParse().loadBufferRemainder().toString();

//             setMeta({
//                 name: parseText("name"),
//                 symbol: parseText("symbol"),
//                 image: parseText("image"),
//                 decimals: parseInt(parseText("decimals") || "9"),
//             });
//         };

//         fetchMetadata();
//     }, [minterAddress]);

//     return meta;
// }
