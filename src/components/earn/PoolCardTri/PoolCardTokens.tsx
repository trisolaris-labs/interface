import React from 'react'
import { Token } from '@trisolaris/sdk'

import GetTokenLink from '../FarmsPortfolio/GetTokenLink'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'

import { PairContainer, ResponsiveCurrencyLabel } from './PoolCardTri.styles'
import { getPairRenderOrder } from '../../../utils/pools'

type PoolCardTokensProps = {
  tokens: Token[]
}

function PoolCardTokens({ tokens }: PoolCardTokensProps) {
  const { currencies } = getPairRenderOrder(tokens)

  return (
    <PairContainer>
      <GetTokenLink tokens={tokens} />
      <MultipleCurrencyLogo currencies={currencies} size={20} />
      <ResponsiveCurrencyLabel currenciesQty={currencies.length}>
        {currencies.map((currency, index) => `${currency.symbol}${index < currencies.length - 1 ? '-' : ''}`)}
      </ResponsiveCurrencyLabel>
    </PairContainer>
  )
}

export default PoolCardTokens
