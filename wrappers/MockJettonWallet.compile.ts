import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/mocks/mock_jetton_wallet.fc'],
};
