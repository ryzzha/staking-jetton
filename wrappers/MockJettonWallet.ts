import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type MockJettonWalletConfig = {
    ownerAddress: Address;
    minterAddress: Address;
    walletCode: Cell;
};

export function mockJettonWalletConfigToCell(config: MockJettonWalletConfig): Cell {
    return beginCell()
        .storeCoins(0)
        .storeAddress(config.ownerAddress)
        .storeAddress(config.minterAddress)
        .storeRef(config.walletCode)
    .endCell();
}

export class MockJettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MockJettonWallet(address);
    }

    static createFromConfig(config: MockJettonWalletConfig, code: Cell, workchain = 0) {
        const data = mockJettonWalletConfigToCell(config);
        const init = { code, data };
        return new MockJettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTransfer(provider: ContractProvider, via: Sender,
        opts: {
            toAddress: Address;
            queryId: number;
            fwdAmount: bigint;
            jettonAmount: bigint;
            forwardPayload?: Cell;
        }
    ) {
        const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(opts.queryId, 64)
            .storeCoins(opts.jettonAmount)
            .storeAddress(opts.toAddress)
            .storeAddress(via.address)
            .storeUint(0, 1)
            .storeCoins(opts.fwdAmount)
            .storeBit(!!opts.forwardPayload)
        
            if(!!opts.forwardPayload) 
                body.storeRef(opts.forwardPayload || null);

        await provider.internal(via, {
            value: toNano("0.05") + opts.fwdAmount,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: body.endCell(),
        });
    }

    async sendBurn(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number
            jettonAmount: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x595f07bc, 32)
                .storeUint(opts.queryId, 64)
                .storeCoins(opts.jettonAmount)
                .storeAddress(via.address)
                .storeUint(0, 1)
            .endCell(),
        });
    }    
    async getJettonBalance(provider: ContractProvider) {
        const result = (await provider.get('get_wallet_data', [])).stack;
        result.readBigNumber();
    }    
}
