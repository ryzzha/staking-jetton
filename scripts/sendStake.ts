import { Address, beginCell, Cell, fromNano, toNano } from '@ton/ton';
import { Staking, StakingConfig, stakingConfigToCell } from '../wrappers/Staking';
import { compile, NetworkProvider } from '@ton/blueprint';
import { printTransactionFees } from '@ton/sandbox';
import { MockJettonMinter } from '../wrappers/MockJettonMinter';
import { MockJettonWallet } from '../wrappers/MockJettonWallet';

export async function run(provider: NetworkProvider) {

    const minter = provider.open(MockJettonMinter.createFromAddress(Address.parse("kQApBMzuNYZOxG7jZkgmM6k9bS-QQWAarRW1A5Hh1IxW0J_z")));
    const address = await minter.getWalletAddress(Address.parse("0QCsVmoQBfBjqaTkvJ57Q86G9XWtv1E5Zyl8n64ALBN0YkcF"))
    const wallet = provider.open(MockJettonWallet.createFromAddress(address));

    const jettons = toNano("100")

    await wallet.sendTransfer(provider.sender(), {
        toAddress: Address.parse("kQA6wXMq3Wq_z3pZr_5KVYRivOHAqRP51rrBcGNRW4xURaII"),
          queryId: 0,
          fwdAmount: toNano('0.05'),
          jettonAmount: jettons,
        //   forwardPayload: beginCell()
        //         .storeUint(0x77b2286b, 32)
        //         .endCell(),
      });
    console.log("✅ stake " + fromNano(jettons) + " rzh jettons");
    

    // run methods on `staking`
}

