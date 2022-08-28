import React, { useState } from 'react'
import { Token, TokenAmount } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { isMobile } from 'react-device-detect'

import { TYPE } from '../../../theme'

import ClaimRewardModal from './ClaimRewardModalTri'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'
import { ButtonGold } from '../../Button'
import SponsoredFarmLink from '../../SponsoredFarmLink'
import PoolCardTriRewardText from './PoolCardTriRewardText'

import { ChefVersions, EarnedNonTriRewards, NonTriAPR, PoolType } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'

import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

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
  PoolTypeContainer,
  StakedMobilecontainer,
  StyledMultipleCurrencyLogo
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
  poolType: PoolType
}

type ExtendedPoolCardTriProps = PoolCardTriProps & {
  earnedNonTriRewards?: EarnedNonTriRewards[]
  noTriRewards?: boolean
  earnedAmount?: TokenAmount
}

const DefaultPoolCardtri = ({
  apr,
  chefVersion,
  inStaging,
  isLegacy,
  tokens: _tokens,
  totalStakedInUSD,
  version,
  enableClaimButton = false,
  nonTriAPRs,
  friendlyFarmName,
  isFeatured = false,
  earnedNonTriRewards,
  noTriRewards,
  earnedAmount,
  poolType,
  enableModal = () => null
}: { enableClaimButton?: boolean; enableModal?: () => void } & ExtendedPoolCardTriProps) => {
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(false)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  function onCardClick() {
    setShowMore(!showMore)
  }

  function handleClaimClick(event: React.MouseEvent) {
    enableModal()
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
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <CardContainer>
        <StyledPairContainer>
          <SponsoredFarmLink tokens={tokens} farmID={version} />
          <StyledMultipleCurrencyLogo currencies={currencies}/>
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>{farmName}</ResponsiveCurrencyLabel>
        </StyledPairContainer>
        <AprContainer>
          <StyledMutedSubHeader justifyContent="flex-start">APR</StyledMutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AprContainer>
        <StakedContainer>
          <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </StakedContainer>
        <PoolTypeContainer>
          <StyledMutedSubHeader>Pool Type</StyledMutedSubHeader>
          <TYPE.white>{poolType}</TYPE.white>
        </PoolTypeContainer>
        {enableClaimButton ? (
          <ButtonGold
            padding="8px"
            borderRadius="8px"
            maxWidth={isMobile ? '55px' : '74px'}
            height="30px"
            onClick={handleClaimClick}
            justifySelf="start"
            fontSize={isMobile ? '14px' : '16px'}
          >
            Claim
          </ButtonGold>
        ) : (
          <StakedMobilecontainer>
            <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
            <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
          </StakedMobilecontainer>
        )}
        <DetailsContainer>{showMore ? <ChevronUp size="15" /> : <ChevronDown size="15" />}</DetailsContainer>
      </CardContainer>
    </Wrapper>
  )
}

type StablePoolCardTriProps = PoolCardTriProps & { stableSwapPoolName: StableSwapPoolName }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleStableFarm(Number(version), props.stableSwapPoolName)
  const { earnedNonTriRewards, noTriRewards, earnedAmount, poolId, stakedAmount, chefVersion } = stakingInfo

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
          chefVersion={chefVersion}
          earnedNonTriRewards={earnedNonTriRewards}
          noTriRewards={noTriRewards}
          poolId={poolId}
          earnedAmount={earnedAmount}
          stakedAmount={stakedAmount}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
      />
    </>
  )
}

const StakingPoolCardTRI = (props: PoolCardTriProps) => {
  const { version } = props

  const stakingInfo = useSingleFarm(Number(version))

  const { earnedNonTriRewards, noTriRewards, earnedAmount, poolId, stakedAmount, chefVersion } = stakingInfo
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
          chefVersion={chefVersion}
          earnedNonTriRewards={earnedNonTriRewards}
          noTriRewards={noTriRewards}
          poolId={poolId}
          earnedAmount={earnedAmount}
          stakedAmount={stakedAmount}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
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
