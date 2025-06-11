import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Staking, StakingConfig, stakingConfigToCell } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const senderAddress = Address.parse(
        provider.sender()?.address?.toString() ?? '0QDmfg7wy5akJ_SFntrtJN6xZHGwOODPJNqFMLCa_GeDCtAK'
      );

    
    console.log(senderAddress)

    const config: StakingConfig = {
        owner: senderAddress,                          
        percentYear: BigInt(12000000),                                
        lockupPeriod: 60 * 60 * 24 * 30,                           
        collectionContent: 'https://raw.githubusercontent.com/ryzzha/staking-jetton/main/nftStaking.json',   
        commonContent: 'https://raw.githubusercontent.com/ryzzha/staking-jetton/main/nfts',      
        nftItemCode: await compile('NftItem'),                      
        royaltyParams: beginCell()
            .storeUint(0, 16) 
            .storeUint(0, 16) 
            .storeAddress(Address.parse('0QDmfg7wy5akJ_SFntrtJN6xZHGwOODPJNqFMLCa_GeDCtAK')) 
            .endCell()
    };


    // const staking = provider.open(Staking.createFromConfig(config, await compile('Staking')));

    // await staking.sendDeploy(provider.sender(), toNano('0.05'));
    // await provider.waitForDeploy(staking.address);
    // console.log("✅ Deployed to:", staking.address.toString());
    

    // run methods on `staking`
}

