import React from 'react'
import styled from 'styled-components'
import { JSBI, ChainId } from '@trisolaris/sdk'

import Card from '../Card'
import { AutoRow } from '../Row'
import spacemanOnPlanet from '../../assets/svg/spaceman_on_planet.svg'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'

import { useFarms } from '../../state/stake/apr'
import { useActiveWeb3React } from '../../hooks'
import { useFarmsPortfolio } from '../../state/stake/useFarmsPortfolio'

import { addCommasToNumber } from '../../utils'

import { TYPE } from '../../theme'
import { BIG_INT_ZERO } from '../../constants'
import { TRI } from '../../constants'

const StyledCard = styled(Card)`
  background: ${({ theme }) => `radial-gradient(farthest-corner at 0% 0%, ${theme.primary1} 0%, transparent 70%)`};
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  min-height: 160px;
`

const SpacemanContainer = styled.div`
  position: absolute;
  right: 0px;
  max-height: 144px;
  max-width: 240px;
  overflow: hidden;
  & > * {
    object-position: 24px 16px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
        max-height: 90px;
        & > * {
            height: 200px;
            width: 150px;
            object-position: 24px 16px;
        }
  `};
`
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
const StyledAutoColumn = styled(AutoColumn)`
  padding-top: 1rem;
  flex: 1;
  max-width: 90%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        max-width: 100%;
  `};
`

export default function FarmBanner() {
  const { account } = useActiveWeb3React()

  const farmTVL = useFarms().reduce((acc, farm) => JSBI.add(acc, JSBI.BigInt(farm.totalStakedInUSD)), BIG_INT_ZERO)
  const farmTVLFriendly = JSBI.GE(farmTVL, BIG_INT_ZERO) ? `$${addCommasToNumber(farmTVL.toString())}` : '-'

  const { dualRewards, triRewards, triRewardsFriendlyAmount, userTotalStaked } = useFarmsPortfolio() ?? {}

  return (
    <StyledCard>
      <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start', position: 'relative' }}>
        <StyledAutoColumn>
          <TYPE.largeHeader>Farm</TYPE.largeHeader>
          <TYPE.subHeader marginTop="1rem">TVL: {farmTVLFriendly}</TYPE.subHeader>
          {account && (
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
                      <div>
                        <CurrencyLogo currency={token.token} size={'16px'} /> {token.amount}
                      </div>
                    ))}
                  </StyledTokensContainer>
                </>
              )}
            </>
          )}
        </StyledAutoColumn>
        <SpacemanContainer>
          <img height="360px" src={spacemanOnPlanet} />
        </SpacemanContainer>
      </AutoRow>
    </StyledCard>
  )
}
