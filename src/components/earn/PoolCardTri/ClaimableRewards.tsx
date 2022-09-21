import { TokenAmount, ChainId } from '@trisolaris/sdk'
import React from 'react'

import CountUp from '../../CountUp'
import { TYPE } from '../../../theme'

import { EarnedNonTriRewards } from '../../../state/stake/stake-constants'
import { TRI } from '../../../constants/tokens'
import { BIG_INT_ZERO } from '../../../constants'

import {
  RewardColumn,
  RewardsContainer,
  StyledCurrencyLogo,
  StyledRewardAmount,
  StyledLongClaimableHeader,
  StyledShortClaimableHeader,
  StyledRewardsAmountContainer
} from './PoolCardTri.styles'

type ClaimableRewardsProps = {
  enableClaimButton: boolean
  noTriRewards: boolean
  earnedAmount?: TokenAmount
  earnedNonTriRewards?: EarnedNonTriRewards[]
  className?: string
}

function ClaimableRewards({
  enableClaimButton,
  noTriRewards,
  earnedAmount,
  earnedNonTriRewards,
  className
}: ClaimableRewardsProps) {
  return (
    <RewardsContainer className={className}>
      <StyledLongClaimableHeader>Claimable rewards</StyledLongClaimableHeader>
      <StyledShortClaimableHeader>Rewards</StyledShortClaimableHeader>

      <StyledRewardsAmountContainer>
        {enableClaimButton ? (
          <>
            {!noTriRewards && (
              <RewardColumn>
                <StyledCurrencyLogo currency={TRI[ChainId.AURORA]} size="14px" />
                <StyledRewardAmount>
                  <CountUp
                    enabled={earnedAmount?.greaterThan(BIG_INT_ZERO) ?? false}
                    value={parseFloat(earnedAmount?.toFixed(6) ?? '0')}
                    decimalPlaces={2}
                  />
                </StyledRewardAmount>
              </RewardColumn>
            )}
            {earnedNonTriRewards?.map(({ amount, token }) => (
              <RewardColumn key={token.address}>
                <StyledCurrencyLogo currency={token} size="14px" />
                <StyledRewardAmount>
                  <CountUp
                    enabled={amount?.greaterThan(BIG_INT_ZERO) ?? false}
                    value={parseFloat(amount?.toFixed(6) ?? '0')}
                    decimalPlaces={2}
                  />
                </StyledRewardAmount>
              </RewardColumn>
            ))}
          </>
        ) : (
          <TYPE.body>-</TYPE.body>
        )}
      </StyledRewardsAmountContainer>
    </RewardsContainer>
  )
}

export default ClaimableRewards
