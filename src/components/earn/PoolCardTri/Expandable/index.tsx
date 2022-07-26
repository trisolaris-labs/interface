import React, { useState } from 'react'
import { Text } from 'rebass'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Currency, ChainId } from '@trisolaris/sdk'

import { ButtonGold } from '../../../Button'
import { AutoColumn } from '../../../Column'
import CountUp from '../../../CountUp'
import { RowBetween } from '../../../Row'
import { TYPE } from '../../../../theme'

import ClaimRewardModal from '../ClaimRewardModalTri'

import { StyledMutedSubHeader } from '../PoolCardTri.styles'

import { StakingTri } from '../../../../state/stake/stake-constants'
import { PoolCardTriProps } from '../'
import { BIG_INT_ZERO } from '../../../../constants'
import { TRI } from '../../../../constants/tokens'

import { currencyId } from '../../../../utils/currencyId'
import { addCommasToNumber } from '../../../../utils'

import {
  TopContainer,
  RewardRow,
  RewardsContainer,
  StyledCurrencyLogo,
  OtherDataAndLinksContainer,
  StyledLink,
  ExpandableStakedContainer
} from './Expandable.styles'

function Expandable({
  totalStakedInUSDFriendly,
  isStaking,
  isPeriodFinished,
  currencies,
  stableSwapPoolName,
  version,
  isLegacy,
  enableClaimButton,
  stakingInfo,
  farmName
}: {
  totalStakedInUSDFriendly: string
  enableClaimButton?: boolean
  currencies: Currency[]
  stakingInfo?: StakingTri
  farmName: string
} & Pick<PoolCardTriProps, 'isStaking' | 'isPeriodFinished' | 'stableSwapPoolName' | 'version' | 'isLegacy'>) {
  const { t } = useTranslation()

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const { earnedNonTriRewards, noTriRewards, earnedAmount, totalRewardRate } = stakingInfo ?? {}

  function handleClaimClick(event: React.MouseEvent) {
    setShowClaimRewardModal(true)
    event.stopPropagation()
  }

  const lpLink = stableSwapPoolName
    ? `/pool/stable/add/${stableSwapPoolName}`
    : `/add/${currencyId(currencies[0])}/${currencyId(currencies[1])}`

  const totalRewardRateFriendly = totalRewardRate ? addCommasToNumber(totalRewardRate.toString()) : 'n/a'

  return (
    <div>
      {stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <TopContainer>
        <RewardsContainer>
          <StyledMutedSubHeader>Unclaimed rewards</StyledMutedSubHeader>
          <RowBetween>
            <AutoColumn>
              {enableClaimButton ? (
                <>
                  {!noTriRewards && (
                    <RewardRow>
                      <StyledCurrencyLogo currency={TRI[ChainId.AURORA]} size="14px" />
                      <CountUp
                        enabled={earnedAmount?.greaterThan(BIG_INT_ZERO) ?? false}
                        value={parseFloat(earnedAmount?.toFixed(6) ?? '0')}
                      />
                    </RewardRow>
                  )}
                  {earnedNonTriRewards?.map(({ amount, token }) => (
                    <RewardRow key={token.address}>
                      <StyledCurrencyLogo currency={token} size="14px" />
                      <CountUp
                        enabled={amount?.greaterThan(BIG_INT_ZERO) ?? false}
                        value={parseFloat(amount?.toFixed(6) ?? '0')}
                      />
                    </RewardRow>
                  ))}
                </>
              ) : (
                <TYPE.mutedSubHeader>Not Staking</TYPE.mutedSubHeader>
              )}
            </AutoColumn>
            <ButtonGold
              padding="8px"
              borderRadius="8px"
              maxWidth="55px"
              height="85%"
              onClick={event => handleClaimClick(event)}
              disabled={!enableClaimButton}
            >
              Claim
            </ButtonGold>
          </RowBetween>
        </RewardsContainer>
        <OtherDataAndLinksContainer>
          <div>Pool rate: {totalRewardRateFriendly}</div>
          <StyledLink onClick={event => event.stopPropagation()} to={lpLink} target="_blank" rel="noopener noreferrer">
            Get {farmName} TLP
            <ArrowUpRight size={14} />
          </StyledLink>
        </OtherDataAndLinksContainer>
      </TopContainer>
      <ExpandableStakedContainer>
        <Text>{t('earn.totalStaked')}</Text>
        <TYPE.white fontWeight={500}>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
      </ExpandableStakedContainer>
    </div>
  )
}

export default Expandable
