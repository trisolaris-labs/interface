import { ChainId, Token } from '@trisolaris/sdk'

import { useDerivedSwapInfo } from '../state/swap/hooks'
import useUSDCPrice from '../hooks/useUSDCPrice'

import { Field } from '../state/swap/actions'
import { USDT } from '../constants/tokens'

const useGetTokenPrice = (token: Token) => {
  const { address: usdtAddress } = USDT[ChainId.AURORA]

  const usdcPrice = useUSDCPrice(token)
  const tradeParameters = usdcPrice
    ? {
        INPUT: { currencyId: undefined },
        OUTPUT: { currencyId: undefined },
        independentField: Field.INPUT,
        recipient: null,
        typedValue: '1'
      }
    : {
        INPUT: { currencyId: token.address },
        OUTPUT: { currencyId: usdtAddress },
        independentField: Field.INPUT,
        recipient: null,
        typedValue: '1'
      }
  const swapToUsdtResult = useDerivedSwapInfo(tradeParameters)

  const { v2Trade } = swapToUsdtResult
  const swapPrice = v2Trade?.executionPrice

  // If getUsdcprice doesn't work, we simulate a swap for getting the price.
  const tokenPrice = usdcPrice ?? swapPrice

  return tokenPrice
}

export default useGetTokenPrice
