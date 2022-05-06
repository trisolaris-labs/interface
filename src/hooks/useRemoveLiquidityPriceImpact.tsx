import { CurrencyAmount, JSBI, Percent, Token } from '@trisolaris/sdk'
import { useEffect, useRef, useState } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { calculatePriceImpact, isStableSwapHighPriceImpact } from '../state/stableswap/hooks'
import useNormalizeTokensToDecimal from './useNormalizeTokensToDecimal'

const INVALID_PERCENTAGES = [new Percent('0'), new Percent('1'), new Percent('-1')]

type Props = {
  estimatedAmounts: CurrencyAmount[]
  lpToken: Token
  virtualPrice: CurrencyAmount | null
  withdrawLPTokenAmount: CurrencyAmount | null
}

export default function useRemoveLiquidityPriceImpact({
  estimatedAmounts,
  lpToken,
  virtualPrice,
  withdrawLPTokenAmount
}: Props) {
  const normalizedInputTokenAmounts = useNormalizeTokensToDecimal({
    currencyAmounts: estimatedAmounts,
    normalizationToken: lpToken
  })
  const normalizedInputTokenSum = normalizedInputTokenAmounts.reduce((acc, amount) => acc.add(amount))
  const normalizedInputTokenSumString = normalizedInputTokenSum.raw.toString()
  const normalizedInputTokenSumRef = useRef(normalizedInputTokenSumString)
  const [priceImpact, setPriceImpact] = useState(BIG_INT_ZERO)
  const isHighImpact = isStableSwapHighPriceImpact(priceImpact)

  useEffect(() => {
    async function updatePriceImpact() {
      const priceImpact = calculatePriceImpact(
        withdrawLPTokenAmount?.raw ?? BIG_INT_ZERO,
        normalizedInputTokenSum.raw,
        virtualPrice?.raw,
        true // isWithdraw
      )

      setPriceImpact(priceImpact)
    }

    if (normalizedInputTokenSumString !== normalizedInputTokenSumRef.current) {
      updatePriceImpact().then(() => {
        normalizedInputTokenSumRef.current = normalizedInputTokenSumString
      })
    }
  }, [normalizedInputTokenSum, normalizedInputTokenSumString, virtualPrice?.raw, withdrawLPTokenAmount?.raw])
  const priceImpactPercent = new Percent(priceImpact, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))

  const isBonus = priceImpactPercent?.greaterThan(new Percent('0')) ?? false

  return {
    isBonus,
    isHighImpact,
    priceImpact: INVALID_PERCENTAGES.some(value => value.equalTo(priceImpactPercent)) ? null : priceImpactPercent
  }
}
