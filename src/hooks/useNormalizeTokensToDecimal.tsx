import React from 'react'
import { CurrencyAmount, JSBI, Token, TokenAmount } from '@trisolaris/sdk'
import { BIG_INT_ZERO } from '../constants'

type Props = {
  currencyAmounts: (CurrencyAmount | undefined)[]
  normalizationToken: Token
}

export default function useNormalizeTokensToDecimal({ currencyAmounts, normalizationToken }: Props) {
  const normalizationDecimal = normalizationToken.decimals

  const normalizedAmounts = currencyAmounts.map(currencyAmount => {
    if (currencyAmount == null) {
      return BIG_INT_ZERO
    }

    const {
      currency: { decimals },
      raw: amount
    } = currencyAmount
    const decimalDelta = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(Math.abs(decimals - normalizationDecimal)))

    switch (true) {
      case decimals > normalizationDecimal:
        return JSBI.divide(amount, decimalDelta)
      case decimals < normalizationDecimal:
        return JSBI.multiply(amount, decimalDelta)
      default:
        return amount
    }
  })

  return normalizedAmounts.map(amount => new TokenAmount(normalizationToken, amount))
}
