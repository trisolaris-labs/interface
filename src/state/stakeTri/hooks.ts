import { Currency, CurrencyAmount, Token } from '@trisolaris/sdk'

import { useCallback } from 'react'
const useTriBar = () => {
    const enter = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            // @TODO
            return;
        },
        []
    )

    const leave = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            // @TODO
            return;
        },
        []
    )

    return { enter, leave }
}

export default useTriBar
