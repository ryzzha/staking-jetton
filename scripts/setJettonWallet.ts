import { Address, beginCell, Cell, toNano } from '@ton/ton';
import { Staking, StakingConfig, stakingConfigToCell } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';
import { printTransactionFees } from '@ton/sandbox';
import { MockJettonMinter } from '../wrappers/MockJettonMinter';
import { MockJettonWallet } from '../wrappers/MockJettonWallet';

export async function run(provider: NetworkProvider) {

    const staking = provider.open(Staking.createFromAddress(Address.parse("kQA6wXMq3Wq_z3pZr_5KVYRivOHAqRP51rrBcGNRW4xURaII")));

    const minter = provider.open(MockJettonMinter.createFromAddress(Address.parse("kQApBMzuNYZOxG7jZkgmM6k9bS-QQWAarRW1A5Hh1IxW0J_z")));
    const address = await minter.getWalletAddress(staking.address)

    await staking.sendJettonWalletAddress(provider.sender(), address);
    console.log("✅ set wallet");
    

    // run methods on `staking`
}

