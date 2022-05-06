import React from 'react'
import { Percent } from '@trisolaris/sdk'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import { PRICE_IMPACT_NEGLIGIBLE_THRESHOLD } from '../../constants'

const Bonus = styled(TYPE.main)`
  color: ${({ theme }) => theme.green1};
`
const HighImpact = styled(TYPE.main)`
  color: ${({ theme }) => theme.yellow2};
`

type Props = {
  bonus: boolean
  errorThreshold?: Percent
  isHighImpact: boolean
  priceImpact: Percent | null
}

export default function StableSwapAddLiquiditySlippage({ bonus, errorThreshold, isHighImpact, priceImpact }: Props) {
  if (priceImpact == null) {
    return <TYPE.main>Slippage: -</TYPE.main>
  }
  const priceImpactFriendly = `${priceImpact.toSignificant(2)}%`

  if (bonus) {
    const bonusIsNegligible = priceImpact.lessThan(PRICE_IMPACT_NEGLIGIBLE_THRESHOLD)
    return bonusIsNegligible ? <Bonus>{'Bonus: <0.01%'}</Bonus> : <Bonus>Bonus: {priceImpactFriendly}</Bonus>
  }

  const slippagePercentage = getSlippagePercentage(priceImpact)
  const slippagePercentageFriendly = `${slippagePercentage.toSignificant(2)}%`

  const isAboveErrorThreshold = errorThreshold != null && priceImpact.lessThan(errorThreshold)
  if (isAboveErrorThreshold) {
    return <TYPE.error error={isAboveErrorThreshold}>Slippage: {slippagePercentageFriendly}</TYPE.error>
  }

  if (isHighImpact) {
    return <HighImpact>Slippage: {slippagePercentageFriendly}</HighImpact>
  }

  const slippageIsNegligible =
    slippagePercentage.equalTo(PRICE_IMPACT_NEGLIGIBLE_THRESHOLD) ||
    slippagePercentage.greaterThan(PRICE_IMPACT_NEGLIGIBLE_THRESHOLD)
  return slippageIsNegligible ? (
    <TYPE.main>{'Slippage: <0.01%'}</TYPE.main>
  ) : (
    <TYPE.main>Slippage: {slippagePercentageFriendly}</TYPE.main>
  )
}

export function getSlippagePercentage(priceImpact: Percent) {
  const { denominator, numerator } = priceImpact.multiply('-1')

  return new Percent(numerator, denominator)
}
