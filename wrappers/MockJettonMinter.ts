import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano, TupleItemSlice } from '@ton/core';

export type MockJettonMinterConfig = {
    adminAddress: Address;
    content: Cell;
    jettonWalletCode: Cell;
};

export function mockJettonConfigToCell(config: MockJettonMinterConfig): Cell {
    return beginCell()
        .storeCoins(0)
        .storeAddress(config.adminAddress)
        .storeRef(config.content)
        .storeRef(config.jettonWalletCode)
    .endCell();
}

export class MockJettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MockJettonMinter(address);
    }

    static createFromConfig(config: MockJettonMinterConfig, code: Cell, workchain = 0) {
        const data = mockJettonConfigToCell(config);
        const init = { code, data };
        return new MockJettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendMint(provider: ContractProvider, via: Sender, 
        opts: {
            toAddress: Address;
            jettonAmount: bigint;
            queryId: number;
        }
    ) {
        await provider.internal(via, {
            value: toNano("0.1"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(21, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.toAddress)
                .storeCoins(toNano("0.02"))
                .storeRef(
                    beginCell()
                        .storeUint(0x178d4519, 32)
                        .storeUint(opts.queryId, 64)
                        .storeCoins(opts.jettonAmount)
                        .storeAddress(this.address)
                        .storeAddress(this.address)
                        .storeCoins(0)
                        .storeUint(0, 1)
                    .endCell()
                )
            .endCell(),
        });
    }

    async getWalletAddress(provider: ContractProvider, address: Address) : Promise<Address> {
        const result = await provider.get('get_wallet_address', [
            {
                type: 'slice',
                cell: beginCell().storeAddress(address).endCell()
            } as TupleItemSlice
        ]);

        return result.stack.readAddress();
    }

    async getTotalsupply(provider: ContractProvider) : Promise<bigint> {
        const result = await provider.get('get_jetton_data', []);
        return result.stack.readBigNumber();
    }
  
}
