import React, { useMemo } from 'react'
import styled from 'styled-components'
import { JSBI } from '@trisolaris/sdk'

import Card from '../Card'
import { AutoRow } from '../Row'
import spacemanOnPlanet from '../../assets/svg/spaceman_on_planet.svg'
import { AutoColumn } from '../Column'

import { useFarms } from '../../state/stake/apr'
import { useActiveWeb3React } from '../../hooks'
import { useFarmsPortfolio } from '../../state/stake/useFarmsPortfolio'
import useTriPrice from '../../hooks/useTriPrice'

import { addCommasToNumber } from '../../utils'

import { TYPE } from '../../theme'
import { BIG_INT_ZERO } from '../../constants'

const StyledCard = styled(Card)`
  background: ${({ theme }) => `radial-gradient(farthest-corner at 0% 0%, ${theme.primary1} 0%, transparent 70%)`};
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
`

const IconContainer = styled.div`
  max-height: 144px;
  max-width: 240px;
  overflow: hidden;
  & > * {
    object-position: 16px 16px;
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

export default function FarmBanner() {
  const { account } = useActiveWeb3React()

  const farmTVL = useFarms().reduce((acc, farm) => JSBI.add(acc, JSBI.BigInt(farm.totalStakedInUSD)), BIG_INT_ZERO)
  const farmTVLFriendly = JSBI.GE(farmTVL, BIG_INT_ZERO) ? `$${addCommasToNumber(farmTVL.toString())}` : '-'

  const { dualRewards, triRewards, triRewardsFriendlyAmount, userTotalStaked } = useFarmsPortfolio() ?? {}

  const result = useFarmsPortfolio() 

  console.log(result)

  const { getTriPrice } = useTriPrice()

  const triPrice = getTriPrice()
  const allTriRewardsUsd = useMemo(() => {
    return triPrice ? triRewards?.multiply(triPrice) : 0
  }, [triPrice, triRewards])

  return (
    <StyledCard>
      <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start' }}>
        <AutoColumn style={{ paddingTop: '1rem' }}>
          <TYPE.largeHeader>Farm</TYPE.largeHeader>
          <TYPE.subHeader marginTop="1rem">TVL: {farmTVLFriendly}</TYPE.subHeader>
          {account && (
            <>
              <TYPE.subHeader marginTop="1rem">Your total staked amount: {userTotalStaked} </TYPE.subHeader>
              <TYPE.subHeader marginTop="1rem">
                Your TRI rewards in USD: ${allTriRewardsUsd?.toFixed(2)}{' '}
              </TYPE.subHeader>
              {triRewards && (
                <>
                  <TYPE.subHeader marginTop="1rem">Your Claimable tokens:</TYPE.subHeader>
                  <TYPE.subHeader marginTop="1rem">
                    TRI: {triRewardsFriendlyAmount} {dualRewards?.map(token => `${token.token}: ${token.amount}  `)}
                  </TYPE.subHeader>
                </>
              )}
            </>
          )}
        </AutoColumn>
        <IconContainer>
          <img height="360px" src={spacemanOnPlanet} />
        </IconContainer>
      </AutoRow>
    </StyledCard>
  )
}
