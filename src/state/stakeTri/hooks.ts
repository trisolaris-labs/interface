import { ChainId, Currency, CurrencyAmount, Token } from '@trisolaris/sdk';

import { useCallback } from 'react';
import { useTransactionAdder } from '../transactions/hooks';
import { useActiveWeb3React } from '../../hooks';
import { useContract } from '../stake/hooks-sushi';
import { Contract } from '@ethersproject/contracts';
import { abi as TRIBAR_ABI } from '../../constants/abis/TriBar.json'

export const TRIBAR_ADDRESS: { [chainId: number]: string } = {
    // @TODO Update Deployed Address
    [ChainId.AURORA]: '0x0000000000000000000000000000000000000000',
}

const useTriBar = () => {
    const addTransaction = useTransactionAdder();
    const barContract = useTriBarContract();

    const enter = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.quotient) {
                const tx = await barContract?.enter(amount?.quotient.toString());
                return addTransaction(tx, { summary: 'Enter TriBar' });
            }
        },
        [addTransaction, barContract]
    );

    const leave = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.quotient) {
                const tx = await barContract?.leave(amount?.quotient.toString());
                return addTransaction(tx, { summary: 'Leave TriBar' });
            }
        },
        [addTransaction, barContract]
    );

    return { enter, leave }
}

export function useTriBarContract(withSignerIfPossible?: boolean): Contract | null {
    const { chainId } = useActiveWeb3React()
    return useContract(chainId && TRIBAR_ADDRESS[chainId], TRIBAR_ABI, withSignerIfPossible)
}

export default useTriBar
