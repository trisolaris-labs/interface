import React, { useState } from 'react'
import { Token, ChainId } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { isMobileOnly } from 'react-device-detect'

import { TYPE } from '../../../theme'

import ClaimRewardModal from './ClaimRewardModalTri'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'
import { ButtonGold } from '../../Button'
import CountUp from '../../CountUp'
import SponsoredFarmLink from '../../SponsoredFarmLink'
import PoolCardTriRewardText from './PoolCardTriRewardText'

import { ChefVersions, NonTriAPR } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'

import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

import { BIG_INT_ZERO } from '../../../constants'
import { TRI } from '../../../constants/tokens'
import { StakingTri } from '../../../state/stake/stake-constants'
import { StableSwapPoolName } from '../../../state/stableswap/constants'

import {
  ResponsiveCurrencyLabel,
  TokenPairBackgroundColor,
  Wrapper,
  StyledPairContainer,
  StakedContainer,
  AprContainer,
  CardContainer,
  DetailsContainer,
  StyledMutedSubHeader,
  RewardColumn,
  RewardsContainer,
  StyledCurrencyLogo,
  StyledRewardAmount,
  StyledLongClaimableHeader,
  StyledShortClaimableHeader,
  StyledRewardsAmountContainer
} from './PoolCardTri.styles'

export type PoolCardTriProps = {
  apr: number
  hasNonTriRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  noTriRewards: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  tokens: Token[]
  totalStakedInUSD: number
  isStaking: boolean
  version: number
  stableSwapPoolName: StableSwapPoolName | null
  nonTriAPRs: NonTriAPR[]
  friendlyFarmName: string | null
  isFeatured?: boolean
  stakingInfo?: StakingTri
}

const DefaultPoolCardtri = ({
  apr,
  chefVersion,
  inStaging,
  isLegacy,
  isPeriodFinished,
  tokens: _tokens,
  totalStakedInUSD,
  isStaking,
  version,
  enableClaimButton = false,
  stableSwapPoolName,
  nonTriAPRs,
  friendlyFarmName,
  isFeatured = false,
  stakingInfo
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) => {
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { earnedNonTriRewards, noTriRewards, earnedAmount } = stakingInfo ?? {}

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  function onCardClick() {
    setShowMore(!showMore)
  }

  function handleClaimClick(event: React.MouseEvent) {
    setShowClaimRewardModal(true)
    event.stopPropagation()
  }

  const currenciesQty = currencies.length
  const farmName = friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')

  return (
    <Wrapper
      bgColor1={backgroundColor1}
      bgColor2={backgroundColor2}
      isFeatured={isFeatured}
      currenciesQty={currenciesQty}
      onClick={onCardClick}
    >
      {stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <CardContainer>
        <StyledPairContainer>
          <SponsoredFarmLink tokens={tokens} farmID={version} />
          <MultipleCurrencyLogo currencies={currencies} size={isMobileOnly ? 18 : 20} />
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>{farmName}</ResponsiveCurrencyLabel>
        </StyledPairContainer>
        <StakedContainer>
          <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </StakedContainer>
        <AprContainer>
          <StyledMutedSubHeader justifyContent="flex-start">APR</StyledMutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AprContainer>
        <RewardsContainer>
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
        <ButtonGold
          padding="8px"
          borderRadius="8px"
          maxWidth={isMobileOnly ? '55px' : '74px'}
          height="30px"
          onClick={event => handleClaimClick(event)}
          disabled={!enableClaimButton}
          justifySelf="start"
          fontSize={isMobileOnly ? '14px' : '16px'}
        >
          Claim
        </ButtonGold>
        <DetailsContainer>{showMore ? <ChevronUp size="15" /> : <ChevronDown size="15" />}</DetailsContainer>
      </CardContainer>

      {showMore && <div></div>}
    </Wrapper>
  )
}

type StablePoolCardTriProps = PoolCardTriProps & { stableSwapPoolName: StableSwapPoolName }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleStableFarm(Number(version), props.stableSwapPoolName)
  const { earnedAmount, earnedNonTriRewards } = stakingInfo

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const enableModal = () => setShowClaimRewardModal(true)
  return (
    <>
      {showClaimRewardModal && stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        stakingInfo={stakingInfo}
      />
    </>
  )
}

const StakingPoolCardTRI = (props: PoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleFarm(Number(version))

  const { earnedAmount, earnedNonTriRewards } = stakingInfo

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const enableModal = () => setShowClaimRewardModal(true)
  return (
    <>
      {showClaimRewardModal && stakingInfo && (
        <ClaimRewardModal
          isOpen={showClaimRewardModal}
          onDismiss={() => setShowClaimRewardModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        stakingInfo={stakingInfo}
      />
    </>
  )
}

const PoolCardTRI = (props: PoolCardTriProps) => {
  const { isStaking, stableSwapPoolName } = props

  if (!isStaking) {
    return <DefaultPoolCardtri {...props} />
  }

  return stableSwapPoolName == null ? (
    <StakingPoolCardTRI {...props} />
  ) : (
    <StableStakingPoolCardTRI {...props} stableSwapPoolName={stableSwapPoolName} />
  )
}

export default PoolCardTRI
