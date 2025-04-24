import { toNano } from '@ton/core';
import { MockJettonWallet } from '../wrappers/MockJettonWallet';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mockJettonWallet = provider.open(MockJettonWallet.createFromConfig({}, await compile('MockJettonWallet')));

    await mockJettonWallet.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(mockJettonWallet.address);

    // run methods on `mockJettonWallet`
}
