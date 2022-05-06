import { CurrencyAmount, JSBI } from '@trisolaris/sdk'
import { useState, useCallback } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
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
}: Props): { estimatedAmounts: CurrencyAmount[]; getEstimatedAmounts: () => Promise<void>; error: TXError | null } {
  const { poolTokens } = STABLESWAP_POOLS[stableSwapPoolName]
  const poolCurrencies = poolTokens.map(token => unwrappedToken(token))

  const emptyAmounts = poolCurrencies.map(currency => CurrencyAmount.fromRawAmount(currency, BIG_INT_ZERO))
  const [amounts, setAmounts] = useState<CurrencyAmount[]>(emptyAmounts)
  const [error, setError] = useState<TXError | null>(null)

  const swapContract = useStableSwapContract(
    stableSwapPoolName,
    false, // require signer
    isMetaPool(stableSwapPoolName) // if it's a metapool, use unwrapped tokens
  )
  const lpTokensBeingBurned = amount?.raw.toString() ?? '0'
  const estimatedAmounts = lpTokensBeingBurned === '0' ? emptyAmounts : amounts

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

  const getEstimatedAmounts = useCallback(async () => {
    setError(null)

    const promise =
      withdrawTokenIndex != null ? estimateRemovingOneToken(withdrawTokenIndex) : estimateRemoveLiquidity()

    promise.catch((e: TXError) => {
      console.error('Error estimating removed liquidity: ', e)
      setAmounts(emptyAmounts)
      setError(e)
    })
  }, [emptyAmounts, estimateRemoveLiquidity, estimateRemovingOneToken, withdrawTokenIndex])

  return { estimatedAmounts, getEstimatedAmounts, error }
}
