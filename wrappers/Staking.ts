import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type StakingConfig = {};

export function stakingConfigToCell(config: StakingConfig): Cell {
    return beginCell().endCell();
}

export class Staking implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Staking(address);
    }

    static createFromConfig(config: StakingConfig, code: Cell, workchain = 0) {
        const data = stakingConfigToCell(config);
        const init = { code, data };
        return new Staking(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
