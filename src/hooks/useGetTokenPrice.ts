import { ChainId } from '@trisolaris/sdk'

import { useDerivedSwapInfo } from '../state/swap/hooks'
import { Field } from '../state/swap/actions'

import { USDT } from '../constants/tokens'

const useGetTokenPrice = (tokenAddress: string) => {
  const { address: usdtAddress } = USDT[ChainId.AURORA]

  const swapToUsdtResult = useDerivedSwapInfo({
    INPUT: { currencyId: tokenAddress },
    OUTPUT: { currencyId: usdtAddress },
    independentField: Field.INPUT,
    recipient: null,
    typedValue: '1'
  })

  const { v2Trade } = swapToUsdtResult
  return v2Trade?.executionPrice
}

export default useGetTokenPrice
