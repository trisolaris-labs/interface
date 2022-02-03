import React from 'react'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import Card from '../Card'
import { AutoRow } from '../Row'
import spacemanOnPlanet from '../../assets/svg/spaceman_on_planet.svg'
import { AutoColumn } from '../Column'
import { useFarms } from '../../state/stake/apr'
import { addCommasToNumber } from '../../utils'
import { JSBI } from '@trisolaris/sdk'

import { BIG_INT_ZERO } from '../../constants'

import { useFarmsPortfolio } from '../../state/stake/useFarmsPortfolio'

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
  const farmTVL = useFarms().reduce((acc, farm) => JSBI.add(acc, JSBI.BigInt(farm.totalStakedInUSD)), BIG_INT_ZERO)
  const farmTVLFriendly = JSBI.GE(farmTVL, BIG_INT_ZERO) ? `$${addCommasToNumber(farmTVL.toString())}` : '-'

  const portfolio = useFarmsPortfolio()
  // console.log(portfolio)

  return (
    <StyledCard>
      <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start' }}>
        <AutoColumn style={{ paddingTop: '1rem' }}>
          <TYPE.largeHeader>Farm</TYPE.largeHeader>
          <TYPE.subHeader marginTop="1rem">TVL: {farmTVLFriendly}</TYPE.subHeader>
        </AutoColumn>
        <IconContainer>
          <img height="360px" src={spacemanOnPlanet} />
        </IconContainer>
      </AutoRow>
    </StyledCard>
  )
}
