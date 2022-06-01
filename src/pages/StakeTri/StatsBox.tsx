import React, { useCallback, useState } from 'react'
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
import { Info } from 'react-feather'
import { PTRI } from '../../constants/tokens'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'

import { LightCard } from '../../components/Card'
import Popover from '../../components/Popover'

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

const ToggleRow = styled(FixedHeightRow)`
  justify-content: flex-end;
`

const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 0.25rem;
`

const PTRI_REWARDS_TOKEN = STABLESWAP_POOLS.USDC_USDT_USN.poolTokens

function StatsBox() {
  const {
    totalStaked,
    totalStakedInUsd,
    userStaked,
    userStakedInUsd,
    userStakedPercentage,
    userClaimableRewards,
    userClaimableRewardsInUsd
  } = usePtriStakeInfo()
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  const [rewardsInTokens, setRewardsInTokens] = useState(true)

  return (
    <LightCard>
      <FixedHeightRow>
        <RowFixed>
          <Popover
            content={
              <>
                <TYPE.main textAlign="center">
                  Forecasted annualized return,
                  <br /> based on the revenue collected over <br /> the previous seven days.
                </TYPE.main>
              </>
            }
            show={show}
          >
            <IconWrapper onMouseEnter={open} onMouseLeave={close}>
              <TYPE.largeHeader marginRight="4px">APR</TYPE.largeHeader>
              <Info size="18px" />
            </IconWrapper>
          </Popover>
        </RowFixed>
        <RowFixed>
          <TYPE.largeHeader>Coming Soon</TYPE.largeHeader>
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="20px">
        <RowFixed>Your pTRI</RowFixed>
        <RowFixed>
          {rewardsInTokens ? (
            <>
              <CurrencyLogo currency={PTRI[ChainId.AURORA]} size="16px" />
              <StyledStakedAmount>{userStaked.toFixed(2)}</StyledStakedAmount>
            </>
          ) : (
            <span>${userStakedInUsd}</span>
          )}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed>Total pTRI</RowFixed>
        <RowFixed>
          {rewardsInTokens ? (
            <>
              <CurrencyLogo currency={PTRI[ChainId.AURORA]} size="16px" />
              <StyledStakedAmount>{totalStaked.toFixed(2)}</StyledStakedAmount>
            </>
          ) : (
            <span>${totalStakedInUsd}</span>
          )}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed>Your Share</RowFixed>
        <RowFixed>
          <span>{userStakedPercentage.toSignificant(2)}%</span>
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed alignItems="center">Your Rewards</RowFixed>
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
      <ToggleRow marginTop="20px">
        <TYPE.small marginRight="0.5rem">Show data in</TYPE.small>
        <Toggle
          isActive={rewardsInTokens}
          toggle={() => setRewardsInTokens(!rewardsInTokens)}
          customToggleText={{ off: '$ USD', on: 'Tokens' }}
          fontSize="10px"
        />
      </ToggleRow>
    </LightCard>
  )
}

export default StatsBox
