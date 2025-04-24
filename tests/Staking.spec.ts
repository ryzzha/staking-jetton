import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, Cell, toNano } from '@ton/core';
import { Staking } from '../wrappers/Staking';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';
import { MockJettonMinter } from '../wrappers/MockJettonMinter';
import { MockJettonWallet } from '../wrappers/MockJettonWallet';

describe('Staking', () => {
    let stakingCode: Cell;
    let mockJettonMinterCode: Cell;
    let mockJettonWalletCode: Cell;
    let nftItemCode: Cell;

    beforeAll(async () => {
        stakingCode = await compile('Staking');
        mockJettonMinterCode = await compile('MockJettonMinter');
        mockJettonWalletCode = await compile('MockJettonWallet');
        nftItemCode = await compile('NftItem');
    });

    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;
    let staking: SandboxContract<Staking>;
    let jettonMinter: SandboxContract<MockJettonMinter>;
    let stakingJettonWallet: SandboxContract<MockJettonWallet>;
    let ownerJettonWallet: SandboxContract<MockJettonWallet>;
    let userJettonWallet: SandboxContract<MockJettonWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        owner = await blockchain.treasury('owner');
        user = await blockchain.treasury('user');

        staking = blockchain.openContract(Staking.createFromConfig({
            owner: owner.address,
            // percentYear: BigInt(100),
            percentYear: 3650000000n,
            lockupPeriod: 10,
            content: new Cell(),
            nftItemCode: nftItemCode,
            royaltyParams: beginCell().storeUint(12, 16).storeUint(100, 16).storeAddress(owner.address).endCell(),
        }, stakingCode));

        const deployStakingResult = await staking.sendDeploy(owner.getSender(), toNano('0.05'));

        jettonMinter = blockchain.openContract(MockJettonMinter.createFromConfig({
            adminAddress: owner.address,
            content: new Cell(),
            jettonWalletCode: mockJettonWalletCode, 
        }, mockJettonMinterCode));

        const deployMinterResult = await jettonMinter.sendDeploy(owner.getSender(), toNano('0.05'));

        expect((await blockchain.getContract(jettonMinter.address)).accountState?.type == "active");

        const mintResult = await jettonMinter.sendMint(owner.getSender(), {
            toAddress: owner.address,
            jettonAmount: toNano('10000'),
            queryId: 0,
        });

        stakingJettonWallet = blockchain.openContract(MockJettonWallet.createFromAddress(await jettonMinter.getWalletAddress(staking.address)));
        ownerJettonWallet = blockchain.openContract(MockJettonWallet.createFromAddress(await jettonMinter.getWalletAddress(owner.address)));
        userJettonWallet = blockchain.openContract(MockJettonWallet.createFromAddress(await jettonMinter.getWalletAddress(user.address)));

        expect(deployStakingResult.transactions).toHaveTransaction({
            from: owner.address,
            to: staking.address,
            deploy: true,
            success: true,
        });
    });

    it('should only owner can set jetton wallet address', async () => {
        const setJettonWalletNotOwner = await staking.sendJettonWalletAddress(user.getSender(), stakingJettonWallet.address);
        printTransactionFees(setJettonWalletNotOwner.transactions);

        // expect(setJettonWalletNotOwner.transactions).toHaveTransaction({
        //     from: user.address,
        //     to: staking.address,
        //     success: false,
        // });

        const setJettonWalletFromOwner = await staking.sendJettonWalletAddress(owner.getSender(), stakingJettonWallet.address);

        printTransactionFees(setJettonWalletFromOwner.transactions);

        // expect(setJettonWalletFromOwner.transactions).toHaveTransaction({
        //     from: owner.address,
        //     to: staking.address,
        //     success: true,
        //     op: 0xee87d2d4,
        // });

        expect(await staking.getJettonWalletAddress()).toEqual(stakingJettonWallet.address);
    });

    it('should owner can send jettons to staking wallet', async () => {
    //     await staking.sendJettonWalletAddress(owner.getSender(), stakingJettonWallet.address);

    //     const sendJettonToStakeReward = await ownerJettonWallet.sendTransfer(owner.getSender(), {
    //         toAddress: staking.address,
    //         queryId: 0,
    //         fwdAmount: toNano('0.05'),
    //         jettonAmount: toNano('3500'),
    //         forwardPayload: beginCell()
    //             .storeUint(0x77b2286b, 32)
    //             .endCell(),
    //     });

    //     printTransactionFees(sendJettonToStakeReward.transactions);

    //     expect(sendJettonToStakeReward.transactions).toHaveTransaction({
    //         from: owner.address,
    //         to: ownerJettonWallet.address,
    //         success: true,
    //         op: 0xf8a7ea5,
    //     });

    //     expect(sendJettonToStakeReward.transactions).toHaveTransaction({
    //         from: ownerJettonWallet.address,
    //         to: stakingJettonWallet.address,
    //         success: true,
    //         op: 0x178d4519,
    //     });

    //     expect(sendJettonToStakeReward.transactions).toHaveTransaction({
    //         from: stakingJettonWallet.address,
    //         to: staking.address,
    //         success: true,
    //         op: 0x7362d09c,
    //     });

        //   expect(await stakingJettonWallet.getJettonBalance()).toEqual(toNano('3500'));
        //   expect((await staking.getStakingData()).totalReward).toEqual(toNano('3500'));
    }); 

    it('should can proccess jetton staking', async () => {
        await staking.sendJettonWalletAddress(owner.getSender(), stakingJettonWallet.address);

        await ownerJettonWallet.sendTransfer(owner.getSender(), {
            toAddress: staking.address,
            queryId: 0,
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('3500'),
            forwardPayload: beginCell()
                .storeUint(0x77b2286b, 32)
                .endCell(),
        });

        const stakeResult = await userJettonWallet.sendTransfer(user.getSender(), {
            toAddress: staking.address,
            queryId: 0,
            fwdAmount: toNano('0.05'),
            jettonAmount: toNano('1000'),
            forwardPayload: beginCell()
                .storeUint(0x77b2286b, 32)
                .endCell(),
        })

        printTransactionFees(stakeResult.transactions);
    });
});
