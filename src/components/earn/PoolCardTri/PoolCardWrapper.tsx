import React from 'react'
import { Token } from '@trisolaris/sdk'

import { useColorForToken } from '../../../hooks/useColor'

import { Wrapper, TokenPairBackgroundColor } from './PoolCardTri.styles'

type PoolCardWrapperProps = {
  tokens: Token[]
  doubleRewards: boolean
  currenciesQty: number
  children: React.ReactNode
}

function PoolCardWrapper({ tokens, doubleRewards, currenciesQty, children }: PoolCardWrapperProps) {
  const backgroundColor1 = useColorForToken(tokens[0])
  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => doubleRewards)

  return (
    <Wrapper
      bgColor1={backgroundColor1}
      bgColor2={backgroundColor2}
      isDoubleRewards={doubleRewards}
      currenciesQty={currenciesQty}
    >
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      {children}
    </Wrapper>
  )
}

export default PoolCardWrapper
