import { Address, beginCell, Cell, toNano } from '@ton/ton';
import { Staking, StakingConfig, stakingConfigToCell } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';
import { printTransactionFees } from '@ton/sandbox';

export async function run(provider: NetworkProvider) {

    const staking = provider.open(Staking.createFromAddress(Address.parse("kQBJnxNZL8gBhFKCA8biCJzAMHdFm29yKNppAjio_6Gq1ros")));

    await staking.sendJettonWalletAddress(provider.sender(), Address.parse("kQC9KkLuMoXRW2zUjeSEj8hI4wAMcbs_jQeLefjWa0ixfRbw"));
    console.log("✅ set wallet");
    

    // run methods on `staking`
}

