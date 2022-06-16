import { CurrencyAmount, JSBI, TokenAmount } from '@trisolaris/sdk'
import React from 'react'
import { isMetaPool, StableSwapPoolName } from '../state/stableswap/constants'
import useStablePoolsData from './useStablePoolsData'

type Props = {
  amount: CurrencyAmount
  poolName: StableSwapPoolName
}

export default function useEstimatestableLPUSDValue({ amount, poolName }: Props) {
  const [{ lpToken, virtualPrice }] = useStablePoolsData(poolName)

  if (lpToken == null || virtualPrice == null) {
    return null
  }

  if (isMetaPool(poolName)) {
    return null
  } else {
    return new TokenAmount(
      lpToken,
      JSBI.divide(JSBI.multiply(virtualPrice.raw, amount.raw), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
    )
  }
}
