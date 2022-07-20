import React, { useState } from 'react'
import { Token } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { TYPE } from '../../../theme'

import ClaimRewardModal from './ClaimRewardModalTri'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'
import Expandable from './Expandable'

import { ChefVersions, NonTriAPR } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'

import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

import { StakingTri } from '../../../state/stake/stake-constants'

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
  RowActionsContainer
} from './PoolCardTri.styles'

import GetTokenLink from '../FarmsPortfolio/GetTokenLink'
import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'
import PoolCardTriRewardText from './PoolCardTriRewardText'

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
  enableModal = () => null,
  stableSwapPoolName,
  nonTriAPRs,
  hasNonTriRewards,
  friendlyFarmName,
  isFeatured = false,
  stakingInfo
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) => {
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(isStaking ? true : false)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  function onCardClick() {
    setShowMore(!showMore)
  }

  const currenciesQty = currencies.length

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
          <GetTokenLink tokens={tokens} />
          <MultipleCurrencyLogo currencies={currencies} size={20} />
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>
            {friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')}
          </ResponsiveCurrencyLabel>
        </StyledPairContainer>
        <StakedContainer>
          <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </StakedContainer>
        <AprContainer>
          <StyledMutedSubHeader justifyContent="flex-start">APR</StyledMutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AprContainer>
        <RowActionsContainer></RowActionsContainer>
        <DetailsContainer>
          {showMore ? (
            <>
              <ChevronUp size="15" />
            </>
          ) : (
            <>
              <ChevronDown size="15" />
            </>
          )}
        </DetailsContainer>
      </CardContainer>

      {showMore && (
        <Expandable
          totalStakedInUSDFriendly={totalStakedInUSDFriendly}
          isStaking={isStaking}
          isPeriodFinished={isPeriodFinished}
          currencies={currencies}
          stableSwapPoolName={stableSwapPoolName}
          version={version}
          isLegacy={isLegacy}
          enableClaimButton={enableClaimButton}
          stakingInfo={stakingInfo}
        />
      )}
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
