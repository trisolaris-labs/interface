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

  return (
    <PairContainer>
      <GetTokenLink tokens={tokens} />
      <MultipleCurrencyLogo currencies={tokens} size={20} />
      <ResponsiveCurrencyLabel currenciesQty={tokens.length}>
        {tokens.map((currency, index) => `${currency.symbol}${index < tokens.length - 1 ? '-' : ''}`)}
      </ResponsiveCurrencyLabel>
    </PairContainer>
  )
}

export default PoolCardTokens
