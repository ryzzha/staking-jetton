import { Address, toNano } from '@ton/core';
import { jettonContentToCell, MockJettonMinter } from '../wrappers/MockJettonMinter';
import { compile, NetworkProvider } from '@ton/blueprint';
import { WalletContractV5R1  } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';
import 'dotenv/config';

export async function run(provider: NetworkProvider) {
    const mnemonic = process.env.WALLET_MNEMONIC!.split(' ');
    const key = await mnemonicToPrivateKey(mnemonic);
    const wallet = WalletContractV5R1.create({ workchain: 0, publicKey: key.publicKey });

    console.log('Address from provider:', provider.sender()?.address);
    console.log('address from create wallet v5r1:', wallet.address.toString({ testOnly: true }));

    const jettonMinterContent = jettonContentToCell({
        type: 1,
        uri: 'https://raw.githubusercontent.com/ryzzha/staking-jetton/main/jettonRzH.json',
    });

    const mockJettonMinter = provider.open(MockJettonMinter.createFromConfig({
        adminAddress: provider.sender()?.address ?? Address.parse("0QDmfg7wy5akJ_SFntrtJN6xZHGwOODPJNqFMLCa_GeDCtAK"),
        jettonWalletCode: await compile('MockJettonWallet'),
        content: jettonMinterContent,
    }, await compile('MockJettonMinter')));

    console.log('Deploying Jetton Minter to:', mockJettonMinter.address.toString());

    await mockJettonMinter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(mockJettonMinter.address);

    console.log('Jetton Minter address:', mockJettonMinter.address.toString());

    console.log('✅ Deployed Jetton Minter!');

}
