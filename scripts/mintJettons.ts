import { Address, beginCell, Cell, fromNano, toNano } from '@ton/ton';
import { Staking, StakingConfig, stakingConfigToCell } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';
import { printTransactionFees } from '@ton/sandbox';
import { MockJettonMinter } from '../wrappers/MockJettonMinter';

export async function run(provider: NetworkProvider) {

    const minter = provider.open(MockJettonMinter.createFromAddress(Address.parse("kQApBMzuNYZOxG7jZkgmM6k9bS-QQWAarRW1A5Hh1IxW0J_z")));

    const jettonsToSend = toNano("1000")

    await minter.sendMint(provider.sender(), { queryId: 1, jettonAmount: jettonsToSend, toAddress: Address.parse("0QCsVmoQBfBjqaTkvJ57Q86G9XWtv1E5Zyl8n64ALBN0YkcF")});
    console.log("✅ send " + fromNano(jettonsToSend) + " rzh jettons");
    

    // run methods on `staking`
}

