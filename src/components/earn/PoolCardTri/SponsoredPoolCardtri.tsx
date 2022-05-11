import React from 'react'
import { ChainId, Token } from '@trisolaris/sdk'

import PoolCardWrapper from './PoolCardWrapper'

import { toV2LiquidityToken } from '../../../state/user/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { getPairRenderOrder } from '../../../utils/pools'

type SponsoredPoolCardTriProps = {
  inStaging: boolean
  isPeriodFinished: boolean
  tokens: Token[]
  depositUrl: string
  doubleRewards: boolean
}

function SponsoredPoolCardTRI({
  inStaging,
  isPeriodFinished,
  tokens,
  depositUrl,
  doubleRewards
}: SponsoredPoolCardTriProps) {
  const { account } = useActiveWeb3React()

  const [token0, token1] = tokens
  const lpToken = toV2LiquidityToken([token0, token1], ChainId.AURORA)

  const { currencies, tokens: orderedTokens } = getPairRenderOrder(tokens)

  const userPoolBalance = useTokenBalance(account ?? undefined, lpToken)

  return (
    <PoolCardWrapper tokens={orderedTokens} doubleRewards={doubleRewards} currenciesQty={currencies.length}>
      <div>{userPoolBalance?.toSignificant(2)}</div>
    </PoolCardWrapper>
  )
}

export default SponsoredPoolCardTRI
