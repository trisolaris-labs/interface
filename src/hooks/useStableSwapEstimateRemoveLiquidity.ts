import { CurrencyAmount, ChainId, BigintIsh, JSBI } from '@trisolaris/sdk'
import { useState, useCallback } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { unwrappedToken } from '../utils/wrappedCurrency'
import { useStableSwapContract } from './useContract'

type Props = {
  amount: CurrencyAmount | undefined
  stableSwapPoolName: StableSwapPoolName
  withdrawTokenIndex: number | null
}

export default function useStableSwapEstimateRemoveLiquidity({
  amount,
  withdrawTokenIndex,
  stableSwapPoolName
}: Props): [CurrencyAmount[], () => Promise<void>] {
  const pool = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const poolCurrencies = pool.poolTokens.map(token => unwrappedToken(token))
  const swapContract = useStableSwapContract(stableSwapPoolName)
  const initialAmounts = poolCurrencies.map(item => CurrencyAmount.fromRawAmount(item, BIG_INT_ZERO))
  const [amounts, setAmounts] = useState<CurrencyAmount[]>(initialAmounts)

  const estimateRemovedLiquidityTokenAmounts = useCallback(async () => {
    const isRemovingOneToken = withdrawTokenIndex != null
    let result: BigintIsh | BigintIsh[]

    if (isRemovingOneToken) {
      result = await swapContract?.calculateRemoveLiquidityOneToken(amount?.raw.toString() ?? '0', withdrawTokenIndex)
    } else {
      result = await swapContract?.calculateRemoveLiquidity(amount?.raw.toString() ?? '0')
    }

    setAmounts(
      poolCurrencies.map((currency, i) => {
        if (isRemovingOneToken) {
          if (i === withdrawTokenIndex) {
            return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(result as BigInt))
          } else {
            return CurrencyAmount.fromRawAmount(currency, BIG_INT_ZERO)
          }
        } else {
          return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt((result as BigInt[])[i]))
        }
      })
    )
  }, [amount?.raw, poolCurrencies, swapContract, withdrawTokenIndex])

  return [amounts, estimateRemovedLiquidityTokenAmounts]
}
