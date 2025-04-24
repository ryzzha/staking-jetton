import { toNano } from '@ton/core';
import { MockJettonMinter } from '../wrappers/MockJettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const mockJettonMinter = provider.open(MockJettonMinter.createFromConfig({}, await compile('MockJettonMinter')));

    await mockJettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(mockJettonMinter.address);

    // run methods on `mockJettonMinter`
}
