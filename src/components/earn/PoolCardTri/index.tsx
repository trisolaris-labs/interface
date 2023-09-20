import React, { useState } from 'react'
import { Token, TokenAmount } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { TYPE } from '../../../theme'

import ClaimRewardModal from './ClaimRewardModalTri'
import { ButtonGold } from '../../Button'
import SponsoredFarmLink from '../../SponsoredFarmLink'
import PoolCardTriRewardText from './PoolCardTriRewardText'
import { AutoRow } from '../../Row'
import ManageStake from './ManageStake'

import { ChefVersions, EarnedNonTriRewards, NonTriAPR, PoolType } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'
import useUserFarmStatistics from '../../../state/stake/useUserFarmStatistics'
import useTLP from '../../../hooks/useTLP'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'

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
  StyledMultipleCurrencyLogo,
  ButtonWrapper,
  StyledClaimableRewards,
  DepositsContainer,
  StakeContainer,
  UserStakedInUsd,
  UserStakedInTLP,
  PoolTypeHeader,
  MobilePoolTypeContainer
} from './PoolCardTri.styles'

export type PoolCardTriProps = {
  apr: number
  hasNonTriRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  noTriRewards: boolean
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
  lpAddress: string
  poolId: number
  zapEnabled: boolean
}

type ExtendedPoolCardTriProps = PoolCardTriProps & {
  earnedNonTriRewards?: EarnedNonTriRewards[]
  noTriRewards?: boolean
  earnedAmount?: TokenAmount
  stakedAmount?: TokenAmount | null
  userStakedInUSD?: string | null
  enableClaimButton?: boolean
  enableClaimModal?: () => void
  lpToken: Token
  isExpanded: boolean
  expandCard?: () => void
}

const DefaultPoolCardtri = ({
  apr,
  chefVersion,
  inStaging,
  tokens: _tokens,
  totalStakedInUSD,
  version,
  enableClaimButton = false,
  nonTriAPRs,
  friendlyFarmName,
  isFeatured = false,
  earnedNonTriRewards = [],
  noTriRewards,
  earnedAmount,
  poolType,
  stakedAmount,
  userStakedInUSD,
  stableSwapPoolName,
  lpAddress,
  poolId,
  lpToken,
  isExpanded,
  zapEnabled,
  enableClaimModal = () => null,
  expandCard = () => null
}: ExtendedPoolCardTriProps) => {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, lpToken)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  const currenciesQty = currencies.length
  const farmName = friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')

  function handleClaimClick(event: React.MouseEvent) {
    enableClaimModal()
    event.stopPropagation()
  }

  const isLegacy = poolType === PoolType.LEGACY

  return (
    <Wrapper
      bgColor1={backgroundColor1}
      bgColor2={backgroundColor2}
      isFeatured={isFeatured}
      currenciesQty={currenciesQty}
      onClick={() => expandCard()}
    >
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <CardContainer>
        <StyledPairContainer>
          <SponsoredFarmLink tokens={tokens} farmID={version} />
          <StyledMultipleCurrencyLogo currencies={currencies} />
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>{farmName}</ResponsiveCurrencyLabel>
          {!isExpanded && <MobilePoolTypeContainer>{poolType}</MobilePoolTypeContainer>}
        </StyledPairContainer>
        <AprContainer>
          <StyledMutedSubHeader justifyContent="flex-start">APR</StyledMutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AprContainer>
        <StakedContainer isExpanded={isExpanded} show={enableClaimButton}>
          <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </StakedContainer>
        <PoolTypeContainer isExpanded={isExpanded} isStaking={enableClaimButton}>
          <PoolTypeHeader>Pool Type</PoolTypeHeader>
          <TYPE.white>{poolType}</TYPE.white>
        </PoolTypeContainer>
        <ButtonWrapper>
          {enableClaimButton ? (
            <ButtonGold padding="8px" borderRadius="8px" height="30px" onClick={handleClaimClick} justifySelf="start">
              Claim
            </ButtonGold>
          ) : (
            <StakedMobilecontainer>
              <StyledMutedSubHeader>{t('earn.totalStaked')}</StyledMutedSubHeader>
              <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
            </StakedMobilecontainer>
          )}
        </ButtonWrapper>
        <DetailsContainer>{isExpanded ? <ChevronUp size="15" /> : <ChevronDown size="15" />}</DetailsContainer>
        {isExpanded && (
          <>
            <StyledClaimableRewards
              enableClaimButton={enableClaimButton}
              noTriRewards={noTriRewards}
              earnedAmount={earnedAmount}
              earnedNonTriRewards={earnedNonTriRewards}
              isStaking={enableClaimButton}
            />
            <DepositsContainer isStaking={enableClaimButton}>
              <>
                <StyledMutedSubHeader>Your deposits</StyledMutedSubHeader>
                <AutoRow>
                  {enableClaimButton ? (
                    <>
                      <UserStakedInUsd>~{addCommasToNumber(userStakedInUSD ?? '')}</UserStakedInUsd>/{' '}
                      <UserStakedInTLP>{stakedAmount?.toSignificant(6)} TLP</UserStakedInTLP>
                    </>
                  ) : (
                    <TYPE.white fontWeight={500}>$0</TYPE.white>
                  )}
                </AutoRow>
              </>
            </DepositsContainer>
            <StakeContainer isStaking={enableClaimButton}>
              <ManageStake
                stakedAmount={stakedAmount}
                isStaking={enableClaimButton}
                stableSwapPoolName={stableSwapPoolName}
                tokens={tokens}
                lpAddress={lpAddress}
                chefVersion={chefVersion}
                poolId={poolId}
                lpToken={lpToken}
                noTriRewards={noTriRewards}
                earnedNonTriRewards={earnedNonTriRewards}
                earnedAmount={earnedAmount}
                userLiquidityUnstaked={userLiquidityUnstaked}
                account={account}
                isLegacy={isLegacy}
                zapEnabled={zapEnabled}
              />
            </StakeContainer>
          </>
        )}
      </CardContainer>
    </Wrapper>
  )
}

type StablePoolCardTriProps = ExtendedPoolCardTriProps & { stableSwapPoolName: StableSwapPoolName; lpToken: Token }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version, stableSwapPoolName, lpToken } = props

  const stakingInfo = useSingleStableFarm(Number(version), stableSwapPoolName)
  const {
    earnedNonTriRewards,
    noTriRewards,
    earnedAmount,
    poolId,
    stakedAmount,
    chefVersion,
    totalStakedInUSD
  } = stakingInfo

  const { userLPAmountUSDFormatted } =
    useUserFarmStatistics({
      lpToken,
      userLPStakedAmount: stakedAmount,
      totalPoolAmountUSD: totalStakedInUSD,
      chefVersion: chefVersion
    }) ?? {}

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))

  const enableClaimModal = () => setShowClaimRewardModal(true)

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
        enableClaimModal={enableClaimModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
        stakedAmount={stakedAmount}
        userStakedInUSD={userLPAmountUSDFormatted}
        stableSwapPoolName={stableSwapPoolName}
      />
    </>
  )
}

const StakingPoolCardTRI = (props: ExtendedPoolCardTriProps & { lpToken: Token }) => {
  const { version, lpToken } = props

  const stakingInfo = useSingleFarm(Number(version))

  const {
    earnedNonTriRewards,
    noTriRewards,
    earnedAmount,
    poolId,
    stakedAmount,
    chefVersion,
    totalStakedInUSD
  } = stakingInfo

  const { userLPAmountUSDFormatted } =
    useUserFarmStatistics({
      lpToken,
      userLPStakedAmount: stakedAmount,
      totalPoolAmountUSD: totalStakedInUSD,
      chefVersion: chefVersion
    }) ?? {}

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))

  const enableClaimModal = () => setShowClaimRewardModal(true)

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
        enableClaimModal={enableClaimModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
        stakedAmount={stakedAmount}
        userStakedInUSD={userLPAmountUSDFormatted}
      />
    </>
  )
}

const PoolCardTRI = (props: PoolCardTriProps) => {
  const { isStaking, stableSwapPoolName, lpAddress, tokens } = props
  const token0 = tokens[0]
  const token1 = tokens[1]
  const lpToken = useTLP({ lpAddress, token0, token1 })

  const [isExpanded, setIsExpanded] = useState(false)

  if (!isStaking) {
    return (
      <DefaultPoolCardtri
        {...props}
        lpToken={lpToken}
        isExpanded={isExpanded}
        expandCard={() => setIsExpanded(!isExpanded)}
      />
    )
  }

  return stableSwapPoolName == null ? (
    <StakingPoolCardTRI
      {...props}
      lpToken={lpToken}
      isExpanded={isExpanded}
      expandCard={() => setIsExpanded(!isExpanded)}
    />
  ) : (
    <StableStakingPoolCardTRI
      {...props}
      stableSwapPoolName={stableSwapPoolName}
      lpToken={lpToken}
      isExpanded={isExpanded}
      expandCard={() => setIsExpanded(!isExpanded)}
    />
  )
}

export default PoolCardTRI
