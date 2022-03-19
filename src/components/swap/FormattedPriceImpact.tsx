import { Percent } from '@trisolaris/sdk'
import React from 'react'
import { ONE_BIPS } from '../../constants'
import { warningSeverity } from '../../utils/prices'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({
  priceImpact,
  isStableSwapPriceImpactSevere,
  isRoutedViaStableSwap
}: {
  priceImpact?: Percent
  isStableSwapPriceImpactSevere?: boolean
  isRoutedViaStableSwap?: boolean
}) {
  return (
    <ErrorText
      fontWeight={500}
      fontSize={14}
      severity={isRoutedViaStableSwap && isStableSwapPriceImpactSevere ? 4 : warningSeverity(priceImpact)}
    >
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
