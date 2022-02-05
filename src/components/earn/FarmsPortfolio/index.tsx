import React from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import CurrencyLogo from '../../CurrencyLogo'

import { useFarmsPortfolio } from '../../../state/stake/useFarmsPortfolio'

import { isTokenAmountPositive } from '../../../utils/pools'

import { TRI } from '../../../constants'
import { TYPE } from '../../../theme'

const StyledTokensContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    '. .'
    '. .'
    '. .'
    '. .';
  ${({ theme }) => theme.mediaWidth.upToXxxSmall`
        grid-template-columns: 1fr 1fr ;
  `};
`

const FarmsPortfolio = () => {
  const { dualRewards, triRewards, triRewardsFriendlyAmount, userTotalStaked } = useFarmsPortfolio() ?? {}

  const hasRewards = isTokenAmountPositive(triRewards) || dualRewards?.some(reward => Number(reward.amount) > 0)
  return (
    <>
      <TYPE.subHeader marginTop="0.3rem">Staked: {userTotalStaked} </TYPE.subHeader>
      {hasRewards && (
        <>
          <TYPE.subHeader marginTop="0.3rem" marginBottom="0.5rem">
            Claimable tokens:
          </TYPE.subHeader>

          <StyledTokensContainer>
            <div>
              <CurrencyLogo currency={TRI[ChainId.AURORA]} size={'16px'} /> {triRewardsFriendlyAmount}
            </div>
            {dualRewards?.map(
              token =>
                Number(token.amount) > 0 && (
                  <div key={token.tokenSymbol}>
                    <CurrencyLogo currency={token.token} size={'16px'} /> {token.amount}
                  </div>
                )
            )}
          </StyledTokensContainer>
        </>
      )}
    </>
  )
}

export default FarmsPortfolio
