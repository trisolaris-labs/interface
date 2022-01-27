import React from 'react'
import { CurrencyAmount, Fraction, JSBI } from '@trisolaris/sdk'

import { BIG_INT_ZERO } from '../../constants'

const CURRENCY_AMOUNT_MIN = new Fraction(JSBI.BigInt(1), JSBI.BigInt(1000000))

export default function FormattedCurrencyAmount({
  currencyAmount,
  significantDigits = 4
}: {
  currencyAmount: CurrencyAmount
  significantDigits?: number
}) {
  return (
    <>
      {currencyAmount.equalTo(BIG_INT_ZERO)
        ? '0'
        : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
        ? currencyAmount.toSignificant(significantDigits)
        : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`}
    </>
  )
}
