import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { ChainId, Token } from '@trisolaris/sdk'

import PoolCardWrapper from './PoolCardWrapper'
import PoolCardTokens from './PoolCardTokens'
import { AutoRow } from '../../Row'
import { AutoColumn } from '../../Column'
import { TYPE } from '../../../theme'
import { ExternalLink } from '../../../theme'

import { toV2LiquidityToken } from '../../../state/user/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { getPairRenderOrder } from '../../../utils/pools'
import { currencyId } from '../../../utils/currencyId'

import { Button } from './PoolCardTri.styles'

const SponsoredButton = styled(Button)`
  max-width: 110px;
  width: 110px;
  font-size: 14px;
`

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
  const history = useHistory()


  const [token0, token1] = tokens
  const lpToken = toV2LiquidityToken([token0, token1], ChainId.AURORA)

  const { tokens: orderedTokens } = getPairRenderOrder(tokens)

  const userPoolBalance = useTokenBalance(account ?? undefined, lpToken)

  const handleAddLiq = () => {
    history.push(`/add/${currencyId(tokens[0])}/${currencyId(tokens[1])}/`)
  }

  return (
    <PoolCardWrapper tokens={orderedTokens} doubleRewards={doubleRewards}>
      <AutoRow justifyContent="space-between">
        <PoolCardTokens tokens={orderedTokens} />
        <SponsoredButton disabled={isPeriodFinished} onClick={handleAddLiq}>
          Add Liquidity
        </SponsoredButton>
      </AutoRow>
      <AutoRow justifyContent="space-between">
        <AutoColumn>
          <TYPE.mutedSubHeader>Your LP Tokens</TYPE.mutedSubHeader>
          <TYPE.white> {userPoolBalance?.toSignificant(2)}</TYPE.white>
        </AutoColumn>
        <ExternalLink href={depositUrl}>
          <SponsoredButton disabled={isPeriodFinished}>Deposit ↗</SponsoredButton>
        </ExternalLink>
      </AutoRow>
    </PoolCardWrapper>
  )
}

export default SponsoredPoolCardTRI
