import { beginCell, toNano } from '@ton/core';
import { Staking, StakingConfig } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const config: StakingConfig = {
        owner: provider.sender().address!,                        
        percentYear: BigInt(2000),                                
        lockupPeriod: 60 * 60 * 24 * 30,                           
        collectionContent: 'https://example.com/collection.json',   
        commonContent: 'https://example.com/common-nft.json',      
        nftItemCode: await compile('NftItem'),                      
        royaltyParams: beginCell()
          .storeUint(0, 1)                                           
          .storeUint(0, 5)
          .storeAddress(provider.sender().address!)                 
          .endCell()
    };
    
    const staking = provider.open(Staking.createFromConfig(config, await compile('Staking')));

    await staking.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(staking.address);
    console.log("✅ Deployed to:", staking.address.toString());
    

    // run methods on `staking`
}
