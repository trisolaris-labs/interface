import { CurrencyAmount, ChainId, JSBI } from '@trisolaris/sdk'
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

type TXError = Error & { reason: string }

export default function useStableSwapEstimateRemoveLiquidity({
  amount,
  withdrawTokenIndex,
  stableSwapPoolName
}: Props): [CurrencyAmount[], () => Promise<void>, TXError | null] {
  const { poolTokens } = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const poolCurrencies = poolTokens.map(token => unwrappedToken(token))

  const initialAmounts = poolCurrencies.map(currency => CurrencyAmount.fromRawAmount(currency, BIG_INT_ZERO))
  const [amounts, setAmounts] = useState<CurrencyAmount[]>(initialAmounts)
  const [error, setError] = useState<TXError | null>(null)

  const swapContract = useStableSwapContract(stableSwapPoolName)
  const resetState = useCallback(() => {
    setAmounts(initialAmounts)
    setError(null)
  }, [initialAmounts])
  const lpTokensBeingBurned = amount?.raw.toString() ?? '0'

  const estimateRemovingOneToken = useCallback(
    (tokenIndex: number) =>
      swapContract?.calculateRemoveLiquidityOneToken(lpTokensBeingBurned, tokenIndex).then((response: BigInt) => {
        setAmounts(
          poolCurrencies.map((currency, i) =>
            CurrencyAmount.fromRawAmount(currency, i === tokenIndex ? JSBI.BigInt(response) : BIG_INT_ZERO)
          )
        )
      }),
    [lpTokensBeingBurned, poolCurrencies, swapContract]
  )

  const estimateRemoveLiquidity = useCallback(
    () =>
      swapContract?.calculateRemoveLiquidity(lpTokensBeingBurned).then((response: BigInt[]) => {
        setAmounts(
          poolCurrencies.map((currency, i) => CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(response[i])))
        )
      }),
    [lpTokensBeingBurned, poolCurrencies, swapContract]
  )

  const estimateRemovedLiquidityTokenAmounts = useCallback(async () => {
    resetState()
    const promise =
      withdrawTokenIndex != null ? estimateRemovingOneToken(withdrawTokenIndex) : estimateRemoveLiquidity()

    promise.catch((e: TXError) => {
      console.error('Error estimating removed liquidity: ', e)
      setError(e)
    })
  }, [estimateRemoveLiquidity, estimateRemovingOneToken, resetState, withdrawTokenIndex])

  return [amounts, estimateRemovedLiquidityTokenAmounts, error]
}
