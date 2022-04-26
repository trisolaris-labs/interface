import React, { useCallback, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModalTri'
import UnstakingModal from '../../components/earn/UnstakingModalTri'
import ClaimRewardModal from '../../components/earn/ClaimRewardModalTri'
import { PageWrapper } from '../../components/Page'
import CountUp from '../../components/CountUp'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'

import { useWalletModalToggle } from '../../state/application/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColorForToken } from '../../hooks/useColor'
import { useSingleFarm } from '../../state/stake/user-farms'
import useUserFarmStatistics from '../../state/stake/useUserFarmStatistics'
import useTLP from '../../hooks/useTLP'

import { currencyId } from '../../utils/currencyId'
import { addCommasToNumber } from '../../utils'
import { getPairRenderOrder } from '../../utils/pools'

import { TYPE } from '../../theme'
import { BIG_INT_ZERO } from '../../constants'
import { ChefVersions, StakingTri } from '../../state/stake/stake-constants'

import {
  PositionInfo,
  BottomSection,
  ResponsiveRowBetween,
  StyledBottomCard,
  PoolData,
  Wrapper,
  BackgroundColor,
  DataRow
} from './Manage.styles'
import { StableSwapPoolName } from '../../state/stableswap/constants'

export default function ManageImpl({
  stableSwapPoolName,
  stakingInfo
}: {
  stableSwapPoolName?: StableSwapPoolName
  stakingInfo: StakingTri
}) {
  const { account } = useActiveWeb3React()

  const {
    chefVersion,
    doubleRewards,
    doubleRewardAmount,
    earnedAmount,
    inStaging,
    noTriRewards,
    lpAddress,
    stakedAmount,
    tokens: _tokens,
    totalRewardRate,
    totalStakedInUSD,
    doubleRewardToken
  } = stakingInfo
  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)
  const token0 = tokens[0]
  const token1 = tokens[1]
  const currency0 = currencies[0]
  const currency1 = currencies[1]

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())
  const totalRewardRateFriendly = addCommasToNumber(totalRewardRate.toString())

  const backgroundColor1 = useColorForToken(tokens[0])
  // Only override `backgroundColor2` if it's a dual rewards pool
  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  // detect existing unstaked LP position to show add button if none found
  const stakedAmountToken = stakedAmount?.token

  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakedAmountToken)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakedAmount || stakedAmount.equalTo(BIG_INT_ZERO)

  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()

  const computedLpToken = useTLP({ lpAddress, token0, token1 })
  const lpToken = computedLpToken

  const { userLPAmountUSDFormatted } =
    useUserFarmStatistics({
      lpToken,
      userLPStakedAmount: stakedAmount,
      totalPoolAmountUSD: totalStakedInUSD,
      chefVersion: chefVersion
    }) ?? {}

  const poolHandle = tokens.map(({ symbol }) => symbol).join('-')

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  const addLiquidityURL =
    stableSwapPoolName == null
      ? `/add/${currency0 && currencyId(currency0)}/${currency1 && currencyId(currency1)}`
      : `/pool/stable/add/${stableSwapPoolName}`

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.largeHeader>
          {poolHandle} {t('earnPage.liquidityMining')}
        </TYPE.largeHeader>
        <MultipleCurrencyLogo currencies={currencies} size={24} separation={20} margin />
      </RowBetween>

      <DataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.subHeader>{t('earnPage.totalStaked')}</TYPE.subHeader>
            <TYPE.body fontSize={24} fontWeight={500}>
              {`$${totalStakedInUSDFriendly}`}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.subHeader>{t('earnPage.poolRate')}</TYPE.subHeader>
            {noTriRewards ? (
              <TYPE.body fontSize={24} fontWeight={500}>
                Non TRI Pool
              </TYPE.body>
            ) : (
              <TYPE.body fontSize={24} fontWeight={500}>
                {`${totalRewardRateFriendly}` + t('earnPage.triPerWeek')}
              </TYPE.body>
            )}
          </AutoColumn>
        </PoolData>
      </DataRow>

      {showAddLiquidityButton ? (
        <HighlightCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.step1')}</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>{t('earnPage.pglTokenRequired', { poolHandle })}</TYPE.white>
              </RowBetween>
              <ButtonPrimary padding="8px" width={'fit-content'} as={Link} to={addLiquidityURL}>
                {t('earnPage.addPoolLiquidity', { poolHandle })}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
        </HighlightCard>
      ) : null}

      {stakingInfo != null ? (
        <>
          <StakingModal
            isOpen={showStakingModal}
            onDismiss={() => setShowStakingModal(false)}
            stakingInfo={stakingInfo}
            userLiquidityUnstaked={userLiquidityUnstaked}
          />
          <UnstakingModal
            isOpen={showUnstakingModal}
            onDismiss={() => setShowUnstakingModal(false)}
            stakingInfo={stakingInfo}
          />
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => setShowClaimRewardModal(false)}
            stakingInfo={stakingInfo}
          />
        </>
      ) : null}

      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <Wrapper disabled={disableTop}>
            <CardSection style={{ position: 'relative' }}>
              <BackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>{t('earnPage.liquidityDeposits')}</TYPE.white>
                </RowBetween>
                <ResponsiveRowBetween style={{ alignItems: 'baseline' }}>
                  {isDualRewards && inStaging ? (
                    // If MasterChefV2, only show the TLP Amount (no $ amount)
                    <>
                      <AutoColumn gap="md">
                        <TYPE.white fontSize={36} fontWeight={600}>
                          {stakedAmount?.toSignificant(6) ?? '-'}
                        </TYPE.white>
                      </AutoColumn>
                      <TYPE.white>TLP {poolHandle}</TYPE.white>
                    </>
                  ) : (
                    // If MasterChefV1, show $ amount as primary text and TLP amount as secondary text
                    <>
                      <AutoColumn gap="md">
                        <TYPE.white fontSize={36} fontWeight={600}>
                          {userLPAmountUSDFormatted ?? '$0'}
                        </TYPE.white>
                      </AutoColumn>
                      <TYPE.white>
                        {stakedAmount?.toSignificant(6) ?? '-'} TLP {poolHandle}
                      </TYPE.white>
                    </>
                  )}
                </ResponsiveRowBetween>
              </AutoColumn>
            </CardSection>
          </Wrapper>
          <StyledBottomCard dim={stakedAmount?.equalTo(BIG_INT_ZERO)}>
            <AutoColumn gap="sm">
              <RowBetween>
                {!noTriRewards ? <TYPE.black>{t('earnPage.unclaimed')} TRI</TYPE.black> : null}
                {(isDualRewards && doubleRewards) || noTriRewards ? (
                  <TYPE.black>
                    {t('earnPage.unclaimed')} {doubleRewardToken.symbol}
                  </TYPE.black>
                ) : null}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                {!noTriRewards ? (
                  <TYPE.largeHeader fontSize={36} fontWeight={600}>
                    <CountUp
                      enabled={earnedAmount?.greaterThan(BIG_INT_ZERO)}
                      value={parseFloat(earnedAmount?.toFixed(6) ?? '0')}
                    />
                  </TYPE.largeHeader>
                ) : null}
                {(isDualRewards && doubleRewards) || noTriRewards ? (
                  <TYPE.largeHeader fontSize={36} fontWeight={600}>
                    <CountUp
                      enabled={doubleRewardAmount?.greaterThan(BIG_INT_ZERO)}
                      value={parseFloat(doubleRewardAmount?.toFixed(6) ?? '0')}
                    />
                  </TYPE.largeHeader>
                ) : null}
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>

        {!showAddLiquidityButton ? (
          <DataRow style={{ marginBottom: '1rem' }}>
            <ButtonPrimary
              borderRadius="8px"
              disabled={userLiquidityUnstaked == null || userLiquidityUnstaked?.equalTo(BIG_INT_ZERO)}
              width="160px"
              padding="8px"
              onClick={handleDepositClick}
            >
              {t('earnPage.depositPglTokens')}
            </ButtonPrimary>

            <ButtonPrimary
              disabled={stakedAmount == null || stakedAmount?.equalTo(BIG_INT_ZERO)}
              padding="8px"
              borderRadius="8px"
              width="160px"
              onClick={() => setShowUnstakingModal(true)}
            >
              Withdraw
            </ButtonPrimary>
            <ButtonPrimary
              disabled={
                earnedAmount == null ||
                (earnedAmount?.equalTo(BIG_INT_ZERO) && doubleRewardAmount?.equalTo(BIG_INT_ZERO))
              }
              padding="8px"
              borderRadius="8px"
              width="160px"
              onClick={() => setShowClaimRewardModal(true)}
            >
              {t('earnPage.claim')}
            </ButtonPrimary>
          </DataRow>
        ) : null}

        {userLiquidityUnstaked?.greaterThan(BIG_INT_ZERO) ? (
          <TYPE.main>
            {userLiquidityUnstaked.toSignificant(6)} {t('earnPage.pglTokenAvailable')}
          </TYPE.main>
        ) : null}
      </PositionInfo>
    </PageWrapper>
  )
}
