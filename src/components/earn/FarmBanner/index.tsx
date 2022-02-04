import React from 'react'
import styled from 'styled-components'
import { JSBI } from '@trisolaris/sdk'

import Card from '../../Card'
import { AutoRow } from '../../Row'
import { AutoColumn } from '../../Column'
import FarmsPortfolio from '../FarmsPortfolio'
import spacemanOnPlanet from '../../../assets/svg/spaceman_on_planet.svg'

import { useFarms } from '../../../state/stake/apr'
import { useActiveWeb3React } from '../../../hooks'

import { addCommasToNumber } from '../../../utils'

import { TYPE } from '../../../theme'
import { BIG_INT_ZERO } from '../../../constants'

const StyledCard = styled(Card)`
  background: ${({ theme }) => `radial-gradient(farthest-corner at 0% 0%, ${theme.primary1} 0%, transparent 70%)`};
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  min-height: 144px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        min-height: 90px;
  `};
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

  return (
    <StyledCard>
      <AutoRow justifyContent="space-between" style={{ alignItems: 'flex-start', position: 'relative' }}>
        <StyledAutoColumn>
          <TYPE.largeHeader>Farm</TYPE.largeHeader>
          <TYPE.subHeader marginTop="1rem">TVL: {farmTVLFriendly}</TYPE.subHeader>
          {account && <FarmsPortfolio />}
        </StyledAutoColumn>
        <SpacemanContainer>
          <img height="360px" src={spacemanOnPlanet} alt="spaceman logo" />
        </SpacemanContainer>
      </AutoRow>
    </StyledCard>
  )
}
