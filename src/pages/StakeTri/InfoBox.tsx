import React from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import { usePtriStakeInfo } from '../../hooks/usePtri'

import { LargeHeaderWhite } from './StakeTriV1'
import { AutoColumn } from '../../components/Column'
import { FixedHeightRow } from '../../components/PositionCard/PositionCard.styles'
import { RowFixed } from '../../components/Row'
import { Info } from 'lucide-react'
import { MouseoverTooltip } from '../../components/Tooltip'
import { ExternalLink } from '../../theme'
import { Text } from 'rebass'
import CurrencyLogo from '../../components/CurrencyLogo'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'

import { TRI } from '../../constants/tokens'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'

const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
background: #0e3f69
border-radius: 10px;
width: 100%;
padding: 2rem;
`

const StyledStakedAmount = styled.span`
  margin: 0 7.5px;
`

const StyledAprContainer = styled.div`
  font-size: 26px;
`

const StyledMouseoverTooltip = styled(MouseoverTooltip)`
  font-size: 0.9rem;
  text-align: center;
  min-width: 360px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  min-width: 190px;
  font-size: 0.75rem;
  `};
`

const StyledLearnMoreContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledExternalLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText1};
  margin: 2px 0 10px;
`

const StyledTextinfo = styled.div`
  margin: 20px 0;
`

function InfoBox() {
  const {
    totalStakedAmount,
    totalStakedInUsd,
    userStaked,
    userStakedInUsd,
    userClaimableRewards,
    userClaimableRewardsInUsd
  } = usePtriStakeInfo()

  const PTRI_REWARDS_TOKEN = STABLESWAP_POOLS.USDC_USDT_USN.poolTokens

  return (
    <StyledContainer>
      <FixedHeightRow>
        <RowFixed>
          <LargeHeaderWhite fontWeight={600} fontSize={36}>
            pTri
          </LargeHeaderWhite>
        </RowFixed>
        <RowFixed>
          <StyledAprContainer>APR XXX%</StyledAprContainer>
        </RowFixed>
      </FixedHeightRow>
      <StyledTextinfo>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit.
      </StyledTextinfo>
      <StyledLearnMoreContainer>
        <StyledExternalLink href=""> Learn more about how it works ↗</StyledExternalLink>
      </StyledLearnMoreContainer>

      <FixedHeightRow marginTop="6px">
        <RowFixed>Total Staked</RowFixed>
        <RowFixed>
          <CurrencyLogo currency={TRI[ChainId.AURORA]} size="16px" />
          <StyledStakedAmount>{totalStakedAmount.toFixed(2)}</StyledStakedAmount> / $ {totalStakedInUsd}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed>Your deposits</RowFixed>
        <RowFixed>
          <CurrencyLogo currency={TRI[ChainId.AURORA]} size="16px" />
          <StyledStakedAmount>{userStaked.toFixed(2)}</StyledStakedAmount> / $ {userStakedInUsd}
        </RowFixed>
      </FixedHeightRow>
      <FixedHeightRow marginTop="6px">
        <RowFixed alignItems="center">
          Your unclaimed rewards
          <StyledMouseoverTooltip text="Rewards in USDT/USDC/USN TLP tokens and pool virtual price">
            <Info size={16} />
          </StyledMouseoverTooltip>
        </RowFixed>
        <RowFixed>
          <MultipleCurrencyLogo currencies={PTRI_REWARDS_TOKEN} size={16} />
          <StyledStakedAmount>{userClaimableRewards.toFixed(2)}</StyledStakedAmount> / $ {userClaimableRewardsInUsd}
        </RowFixed>
      </FixedHeightRow>
    </StyledContainer>
  )
}

export default InfoBox
