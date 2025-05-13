import { toNano } from '@ton/core';
import { jettonContentToCell, MockJettonMinter } from '../wrappers/MockJettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { WalletContractV5R1 } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

export async function run(provider: NetworkProvider) {
    const mnemonic = process.env.MNEMONIC!.split(' ');
    const key = await mnemonicToPrivateKey(mnemonic);

    const wallet = provider.open(
        WalletContractV5R1.create({
            workchain: 0,
            publicKey: key.publicKey,
        })
    );

    const jettonMinterContent = jettonContentToCell({
        type: 1,
        uri: 'https://raw.githubusercontent.com/X1ag/dywe-manifest/refs/heads/main/jettontester.json?token=GHSAT0AAAAAACWRHBR42XSE2SR46QOGOZ2CZ5MFDZQ',
    });

    const mockJettonMinter = provider.open(MockJettonMinter.createFromConfig({
        adminAddress: wallet.address,
        jettonWalletCode: await compile('MockJettonWallet'),
        content: jettonMinterContent,
    }, await compile('MockJettonMinter')));

    console.log('Deploying Jetton Minter to:', mockJettonMinter.address.toString());

    await mockJettonMinter.sendDeploy(wallet.sender(key.secretKey), toNano('0.05'));

    await provider.waitForDeploy(mockJettonMinter.address);

    console.log('Jetton Minter address:', mockJettonMinter.address.toString());

    console.log('✅ Deployed Jetton Minter!');

}
