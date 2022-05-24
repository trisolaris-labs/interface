import React from 'react'
import styled from 'styled-components'

import { usePtriStakeInfo } from '../../hooks/usePtri'

import { LargeHeaderWhite } from './StakeTriV1'
import { AutoColumn } from '../../components/Column'
import { FixedHeightRow } from '../../components/PositionCard/PositionCard.styles'
import { RowFixed } from '../../components/Row'

export const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
background: #191b35
border-radius: 10px;
width: 100%;
padding: 2rem;
`

function InfoBox() {
  const { totalStakedInUsd, userStakedInUsd, userClaimableRewardsInUsd } = usePtriStakeInfo()

  return (
    <StyledContainer>
      <LargeHeaderWhite fontWeight={600} fontSize={36}>
        pTri
      </LargeHeaderWhite>
      <FixedHeightRow marginTop="4px">
        <RowFixed>Total Staked</RowFixed>
        <RowFixed>$ {totalStakedInUsd}</RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="4px">
        <RowFixed>Your deposits</RowFixed>
        <RowFixed>$ {userStakedInUsd}</RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="4px">
        <RowFixed>Your unclaimed rewards</RowFixed>
        <RowFixed>$ {userClaimableRewardsInUsd?.toFixed(2)}</RowFixed>
      </FixedHeightRow>
    </StyledContainer>
  )
}

export default InfoBox
