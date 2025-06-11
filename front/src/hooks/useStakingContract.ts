import { useEffect, useState } from "react";
import { Address } from "@ton/ton";
import type { OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { Staking, type StakingData, type CollectionData } from "../contracts/JettonStaking";

const STAKING_ADDRESS = "kQBJnxNZL8gBhFKCA8biCJzAMHdFm29yKNppAjio_6Gq1ros";

export function useStakingContract() {
  const client = useTonClient();
  const [staking, setStaking] = useState<OpenedContract<Staking> | null>(null);
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null);

  useEffect(() => {
    if (!client) return;

    const initStaking = async () => {
       
      let staking: OpenedContract<Staking>;
      try {
        const contract = Staking.createFromAddress(Address.parse(STAKING_ADDRESS));
        staking = client.open(contract);
        setStaking(staking);

        const stakingData = await staking.getStakingData();
        setStakingData(stakingData);
        console.log(stakingData)
        const collectionData = await staking.getCollectionData();
        setCollectionData(collectionData);
        console.log(stakingData)
      } catch (e) {
        console.error("❌ Error opening staking:", e);
        return;
      }
    };

    initStaking();
  }, [client]);

  return {
    staking,
    stakingData,
    collectionData,
 };
}
