import React from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import CurrencyLogo from '../../CurrencyLogo'

import { useFarmsPortfolio } from '../../../state/stake/useFarmsPortfolio'

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

  return (
    <>
      <TYPE.subHeader marginTop="0.3rem">Your staked: {userTotalStaked} </TYPE.subHeader>
      {triRewards && (
        <>
          <TYPE.subHeader marginTop="0.3rem" marginBottom="0.5rem">
            Your Claimable tokens:
          </TYPE.subHeader>

          <StyledTokensContainer>
            <div>
              <CurrencyLogo currency={TRI[ChainId.AURORA]} size={'16px'} /> {triRewardsFriendlyAmount}
            </div>
            {dualRewards?.map(token => (
              <div key={token.tokenSymbol}>
                <CurrencyLogo currency={token.token} size={'16px'} /> {token.amount}
              </div>
            ))}
          </StyledTokensContainer>
        </>
      )}
    </>
  )
}

export default FarmsPortfolio
