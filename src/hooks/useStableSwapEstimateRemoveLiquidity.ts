import { CurrencyAmount, ChainId, JSBI } from '@trisolaris/sdk'
import { useState, useCallback } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useUserSlippageTolerance } from '../state/user/hooks'
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
  const [userSlippageTolerance] = useUserSlippageTolerance()

  const swapContract = useStableSwapContract(stableSwapPoolName)
  const resetState = useCallback(() => {
    setAmounts(initialAmounts)
    setError(null)
  }, [initialAmounts])
  const lpTokensBeingBurned = amount?.raw.toString() ?? '0'

  const subtractSlippageFromValue = useCallback(
    (value: BigInt) => {
      return JSBI.BigInt(value)

      // @TODO This logic needs to be fixed
      // const amount = JSBI.BigInt(value)
      // const slippageAmount = subtractSlippageFromJSBI(amount, userSlippageTolerance)
      // return JSBI.subtract(amount, slippageAmount)
    },
    // [userSlippageTolerance]
    []
  )

  const estimateRemovingOneToken = useCallback(
    (tokenIndex: number) => {
      return swapContract
        ?.calculateRemoveLiquidityOneToken(lpTokensBeingBurned, tokenIndex)
        .then((response: BigInt) => {
          setAmounts(
            poolCurrencies.map((currency, i) => {
              if (i === tokenIndex) {
                return CurrencyAmount.fromRawAmount(currency, subtractSlippageFromValue(response))
              } else {
                return CurrencyAmount.fromRawAmount(currency, BIG_INT_ZERO)
              }
            })
          )
        })
    },
    [lpTokensBeingBurned, poolCurrencies, subtractSlippageFromValue, swapContract]
  )

  const estimateRemoveLiquidity = useCallback(() => {
    return swapContract?.calculateRemoveLiquidity(lpTokensBeingBurned).then((response: BigInt[]) => {
      setAmounts(
        poolCurrencies.map((currency, i) => {
          return CurrencyAmount.fromRawAmount(currency, subtractSlippageFromValue(response[i]))
        })
      )
    })
  }, [lpTokensBeingBurned, poolCurrencies, subtractSlippageFromValue, swapContract])

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

function subtractSlippageFromJSBI(value: JSBI, slippage: number) {
  return JSBI.divide(JSBI.multiply(value, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000))
}
