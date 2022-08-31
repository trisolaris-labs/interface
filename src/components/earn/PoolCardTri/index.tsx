import React, { useCallback, useState, useEffect } from 'react'
import { Token, TokenAmount } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useHistory } from 'react-router-dom'

import { TYPE } from '../../../theme'

import ClaimRewardModal from './ClaimRewardModalTri'
import { ButtonGold, ButtonPrimary } from '../../Button'
import SponsoredFarmLink from '../../SponsoredFarmLink'
import PoolCardTriRewardText from './PoolCardTriRewardText'
import StakingModal from './StakingModalTri'
import UnstakingModal from './UnstakingModalTri'
import Toggle from '../../Toggle'
import { AutoRow } from '../../Row'

import { ChefVersions, EarnedNonTriRewards, NonTriAPR, PoolType } from '../../../state/stake/stake-constants'
import { useSingleFarm } from '../../../state/stake/user-farms'
import { useColorForToken } from '../../../hooks/useColor'
import { useSingleStableFarm } from '../../../state/stake/user-stable-farms'
import useUserFarmStatistics from '../../../state/stake/useUserFarmStatistics'
import useTLP from '../../../hooks/useTLP'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useWalletModalToggle } from '../../../state/application/hooks'

import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder, isTokenAmountPositive } from '../../../utils/pools'

import { StableSwapPoolName } from '../../../state/stableswap/constants'
import { BIG_INT_ZERO } from '../../../constants'

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
  StakeContainer
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
  stakedAmount?: TokenAmount | null
  userStakedInUSD?: string | null
  enableClaimButton?: boolean
  userLiquidityUnstaked?: TokenAmount
  enableModal?: () => void
  enableDepositModal?: () => void
  enableWithdrawModal?: () => void
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
  stakedAmount,
  userStakedInUSD,
  userLiquidityUnstaked,
  stableSwapPoolName,
  enableModal = () => null,
  enableDepositModal = () => null,
  enableWithdrawModal = () => null
}: ExtendedPoolCardTriProps) => {
  const { t } = useTranslation()
  const history = useHistory()

  const [showMore, setShowMore] = useState(false)
  const [isStaking, setIsStaking] = useState(false)

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  const currenciesQty = currencies.length
  const farmName = friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')

  const addLpLink = stableSwapPoolName
    ? `/pool/stable/add/${stableSwapPoolName}`
    : `add/${tokens[0].address}/${tokens[1].address}`

  const removeLpLink = stableSwapPoolName
    ? `/pool/stable/remove/${stableSwapPoolName}`
    : `remove/${tokens[0].address}/${tokens[1].address}`

  useEffect(() => {
    if (enableClaimButton && !isStaking) {
      setIsStaking(enableClaimButton)
    }
  }, [enableClaimButton])

  function onCardClick() {
    setShowMore(!showMore)
  }

  function handleClaimClick(event: React.MouseEvent) {
    enableModal()
    event.stopPropagation()
  }

  function handleDepositClick(event: React.MouseEvent) {
    enableDepositModal()
    event.stopPropagation()
  }

  function handleWithDrawClick(event: React.MouseEvent) {
    enableWithdrawModal()
    event.stopPropagation()
  }

  function handleToggle(event: React.MouseEvent) {
    setIsStaking(!isStaking)
    event.stopPropagation()
  }

  function handleAddLp(event: React.MouseEvent) {
    history.push(addLpLink)
    event.stopPropagation()
  }

  function handleRemoveLp(event: React.MouseEvent) {
    history.push(removeLpLink)
    event.stopPropagation()
  }

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
          <StyledMultipleCurrencyLogo currencies={currencies} />
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
        <DetailsContainer>{showMore ? <ChevronUp size="15" /> : <ChevronDown size="15" />}</DetailsContainer>
        {showMore && (
          <>
            <StyledClaimableRewards
              enableClaimButton={enableClaimButton}
              noTriRewards={noTriRewards}
              earnedAmount={earnedAmount}
              earnedNonTriRewards={earnedNonTriRewards}
            />
            <DepositsContainer>
              <>
                <StyledMutedSubHeader>Your deposits</StyledMutedSubHeader>
                <AutoRow>
                  {enableClaimButton ? (
                    <>
                      <TYPE.white fontWeight={500} marginRight={10}>
                        ~{addCommasToNumber(userStakedInUSD ?? '')}
                      </TYPE.white>
                      / <TYPE.white marginLeft={10}>{stakedAmount?.toSignificant(6)} TLP</TYPE.white>
                    </>
                  ) : (
                    <TYPE.white fontWeight={500}>$0</TYPE.white>
                  )}
                </AutoRow>
              </>
            </DepositsContainer>
            <StakeContainer>
              <AutoRow justifyContent="space-between">
                <StyledMutedSubHeader>Manage</StyledMutedSubHeader>
                <Toggle
                  customToggleText={{ on: 'Pool', off: 'Stake' }}
                  isActive={!isStaking}
                  toggle={handleToggle}
                  fontSize="12px"
                  padding="2px 6px"
                />
              </AutoRow>
              <AutoRow justifyContent="space-between">
                <ButtonPrimary
                  borderRadius="8px"
                  disabled={
                    isStaking && (userLiquidityUnstaked == null || userLiquidityUnstaked?.equalTo(BIG_INT_ZERO))
                  }
                  width="98px"
                  padding="5px"
                  fontSize="14px"
                  onClick={isStaking ? handleDepositClick : handleAddLp}
                >
                  {isStaking ? t('earnPage.depositPglTokens') : 'Add LP'}
                </ButtonPrimary>
                <ButtonPrimary
                  disabled={
                    (isStaking && (stakedAmount == null || stakedAmount?.equalTo(BIG_INT_ZERO))) ||
                    (!isStaking && userLiquidityUnstaked?.equalTo(BIG_INT_ZERO))
                  }
                  padding="5px"
                  borderRadius="8px"
                  width="98px"
                  onClick={isStaking ? handleWithDrawClick : handleRemoveLp}
                  fontSize="14px"
                >
                  {isStaking ? 'Withdraw' : 'Remove LP'}
                </ButtonPrimary>
              </AutoRow>
            </StakeContainer>
          </>
        )}
      </CardContainer>
    </Wrapper>
  )
}

type StablePoolCardTriProps = PoolCardTriProps & { stableSwapPoolName: StableSwapPoolName }

const StableStakingPoolCardTRI = (props: StablePoolCardTriProps) => {
  const { version, stableSwapPoolName } = props
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const stakingInfo = useSingleStableFarm(Number(version), stableSwapPoolName)
  const {
    earnedNonTriRewards,
    noTriRewards,
    earnedAmount,
    poolId,
    stakedAmount,
    chefVersion,
    totalStakedInUSD,
    lpAddress,
    tokens
  } = stakingInfo
  const token0 = tokens[0]
  const token1 = tokens[1]

  const lpToken = useTLP({ lpAddress, token0, token1 })

  const { userLPAmountUSDFormatted } =
    useUserFarmStatistics({
      lpToken,
      userLPStakedAmount: stakedAmount,
      totalPoolAmountUSD: totalStakedInUSD,
      chefVersion: chefVersion
    }) ?? {}

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)

  const stakedAmountToken = stakedAmount?.token

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakedAmountToken)

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))

  const enableModal = () => setShowClaimRewardModal(true)

  const enableDepositModal = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

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
      {showStakingModal && stakingInfo && (
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          stakingInfo={stakingInfo}
          userLiquidityUnstaked={userLiquidityUnstaked}
        />
      )}
      {showUnstakingModal && stakingInfo && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
        stakedAmount={stakedAmount}
        userStakedInUSD={userLPAmountUSDFormatted}
        userLiquidityUnstaked={userLiquidityUnstaked}
        enableDepositModal={enableDepositModal}
        enableWithdrawModal={() => setShowUnstakingModal(true)}
        stableSwapPoolName={stableSwapPoolName}
      />
    </>
  )
}

const StakingPoolCardTRI = (props: PoolCardTriProps) => {
  const { version } = props

  const { account } = useActiveWeb3React()
  const stakingInfo = useSingleFarm(Number(version))
  const toggleWalletModal = useWalletModalToggle()

  const {
    earnedNonTriRewards,
    noTriRewards,
    earnedAmount,
    poolId,
    stakedAmount,
    chefVersion,
    totalStakedInUSD,
    lpAddress,
    tokens
  } = stakingInfo
  const token0 = tokens[0]
  const token1 = tokens[1]

  const lpToken = useTLP({ lpAddress, token0, token1 })

  const { userLPAmountUSDFormatted } =
    useUserFarmStatistics({
      lpToken,
      userLPStakedAmount: stakedAmount,
      totalPoolAmountUSD: totalStakedInUSD,
      chefVersion: chefVersion
    }) ?? {}

  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)

  const stakedAmountToken = stakedAmount?.token
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakedAmountToken)

  const amountIsClaimable =
    isTokenAmountPositive(earnedAmount) || earnedNonTriRewards.some(({ amount }) => isTokenAmountPositive(amount))

  const enableModal = () => setShowClaimRewardModal(true)

  const enableDepositModal = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

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
      {showStakingModal && stakingInfo && (
        <StakingModal
          isOpen={showStakingModal}
          onDismiss={() => setShowStakingModal(false)}
          stakingInfo={stakingInfo}
          userLiquidityUnstaked={userLiquidityUnstaked}
        />
      )}
      {showUnstakingModal && stakingInfo && (
        <UnstakingModal
          isOpen={showUnstakingModal}
          onDismiss={() => setShowUnstakingModal(false)}
          stakingInfo={stakingInfo}
        />
      )}
      <DefaultPoolCardtri
        {...props}
        enableClaimButton={amountIsClaimable}
        enableModal={enableModal}
        earnedNonTriRewards={earnedNonTriRewards}
        noTriRewards={noTriRewards}
        earnedAmount={earnedAmount}
        stakedAmount={stakedAmount}
        userStakedInUSD={userLPAmountUSDFormatted}
        userLiquidityUnstaked={userLiquidityUnstaked}
        enableDepositModal={enableDepositModal}
        enableWithdrawModal={() => setShowUnstakingModal(true)}
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
