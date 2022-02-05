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
  gap: 2.5px 0px;
  grid-template-areas:
    '. .'
    '. .'
    '. .'
    '. .';
  ${({ theme }) => theme.mediaWidth.upToXxxSmall`
        grid-template-columns: 1fr 1fr ;
  `};
`

const CurrencyContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledRewardAmount = styled.span`
  font-size: 14px;
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
            <CurrencyContainer>
              <CurrencyLogo currency={TRI[ChainId.AURORA]} size={'16px'} style={{ marginRight: '5px' }} />{' '}
              <StyledRewardAmount> {triRewardsFriendlyAmount}</StyledRewardAmount>
            </CurrencyContainer>
            {dualRewards?.map(
              token =>
                Number(token.amount) > 0 && (
                  <CurrencyContainer key={token.tokenSymbol}>
                    <CurrencyLogo currency={token.token} size={'16px'} style={{ marginRight: '5px' }} />{' '}
                    <StyledRewardAmount>{token.amount}</StyledRewardAmount>
                  </CurrencyContainer>
                )
            )}
          </StyledTokensContainer>
        </>
      )}
    </>
  )
}

export default FarmsPortfolio
