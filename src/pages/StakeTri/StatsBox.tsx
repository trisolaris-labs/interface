import React, { useState } from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import { AutoColumn } from '../../components/Column'
import { FixedHeightRow } from '../../components/PositionCard/PositionCard.styles'
import { RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'
import Toggle from '../../components/Toggle'
import { TYPE } from '../../theme'

import { usePtriStakeInfo } from '../../hooks/usePtri'

import { TRI } from '../../constants/tokens'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'

import { LightCard } from '../../components/Card'

export const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
  background: #0e3f69
  border-radius: 10px;
  width: 100%;
  padding: 2rem 2rem 1rem 2rem;
  height: 100%;
  position: relative;
`

const StyledStakedAmount = styled.span`
  margin-left: 5px;
`

const PTRI_REWARDS_TOKEN = STABLESWAP_POOLS.USDC_USDT_USN.poolTokens

function StatsBox() {
  const {
    totalStakedAmount,
    totalStakedInUsd,
    userStaked,
    userStakedInUsd,
    userClaimableRewards,
    userClaimableRewardsInUsd
  } = usePtriStakeInfo()

  const [rewardsInTokens, setRewardsInTokens] = useState(true)

  return (
    <LightCard>
      <FixedHeightRow>
        <RowFixed>
          <TYPE.largeHeader>APR</TYPE.largeHeader>
        </RowFixed>
        <RowFixed>
          <TYPE.largeHeader>XXX%</TYPE.largeHeader>
        </RowFixed>
      </FixedHeightRow>

      <FixedHeightRow marginTop="20px">
        <RowFixed>Total Staked</RowFixed>
        <RowFixed>
          {rewardsInTokens ? (
            <>
              <CurrencyLogo currency={TRI[ChainId.AURORA]} size="16px" />
              <StyledStakedAmount>{totalStakedAmount.toFixed(2)}</StyledStakedAmount>
            </>
          ) : (
            <span>${totalStakedInUsd}</span>
          )}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed>Your deposits</RowFixed>
        <RowFixed>
          {rewardsInTokens ? (
            <>
              <CurrencyLogo currency={TRI[ChainId.AURORA]} size="16px" />
              <StyledStakedAmount>{userStaked.toFixed(2)}</StyledStakedAmount>
            </>
          ) : (
            <span>${userStakedInUsd}</span>
          )}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed alignItems="center">Your rewards</RowFixed>
        {/* <RowFixed>
          <MultipleCurrencyLogo currencies={PTRI_REWARDS_TOKEN} size={16} />
          <StyledStakedAmount>{userClaimableRewards.toFixed(2)}</StyledStakedAmount> / $ {userClaimableRewardsInUsd}
        </RowFixed> */}
        <RowFixed>
          {rewardsInTokens ? (
            <>
              <MultipleCurrencyLogo currencies={PTRI_REWARDS_TOKEN} size={16} />
              <StyledStakedAmount>{userClaimableRewards.toFixed(2)}</StyledStakedAmount>
            </>
          ) : (
            <span>${userClaimableRewardsInUsd}</span>
          )}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="20px">
        <RowFixed>Show data in:</RowFixed>
        <Toggle
          isActive={rewardsInTokens}
          toggle={() => setRewardsInTokens(!rewardsInTokens)}
          customToggleText={{ off: '$ USD', on: 'Tokens' }}
          fontSize="12px"
        />
      </FixedHeightRow>
    </LightCard>
  )
}

export default StatsBox
