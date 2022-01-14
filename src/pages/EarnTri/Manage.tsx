import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { JSBI } from '@trisolaris/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, HighlightCard } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModalTri'
import UnstakingModal from '../../components/earn/UnstakingModalTri'
import ClaimRewardModal from '../../components/earn/ClaimRewardModalTri'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColorForToken } from '../../hooks/useColor'

import { currencyId } from '../../utils/currencyId'
import { useTranslation } from 'react-i18next'
import { useSingleFarm } from '../../state/stake/user-farms'
import useUserFarmStatistics from '../../state/stake/useUserFarmStatistics'
import { PageWrapper } from '../../components/Page'
import { Card } from 'rebass'
import { DarkGreyCard } from '../../components/Card'
import { addCommasToNumber } from '../../utils'
import CountUp from '../../components/CountUp'
import useTLP from '../../hooks/useTLP'
import { getPairRenderOrder } from '../../utils/pools'

const PositionInfo = styled(AutoColumn) <{ dim: any }>`
  position: relative;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const ResponsiveRowBetween = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const StyledBottomCard = styled(DataCard) <{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  padding: 1rem 1.25rem;
`

const PoolData = styled(DarkGreyCard)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 110px;
    text-align: center;
  `};
`

const Wrapper = styled(Card)`
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
`

const VoteCard = styled(HighlightCard)`
  // background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  // overflow: hidden;
`

const BackgroundColor = styled.span< { bgColor1: string | null, bgColor2?: string | null }>`
   background: ${({ theme, bgColor1, bgColor2 }) =>
    `linear-gradient(90deg, ${bgColor1 ?? theme.blue1} 0%, ${bgColor2 ?? 'grey'} 90%);`
  }
   background-size: cover;
   mix-blend-mode: overlay;
   border-radius: 10px;
   width: 100%;
   height: 100%;
   opacity: 0.5;
   position: absolute;
   top: 0;
   left: 0;
   user-select: none;
`

const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
     gap: 12px;
   `};
`

const ZERO = JSBI.BigInt(0);

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB, version }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; version: string }>) {
  const { account } = useActiveWeb3React()

  const stakingInfo = useSingleFarm(Number(version));
  const {
    chefVersion,
    doubleRewards,
    doubleRewardAmount,
    earnedAmount,
    inStaging,
    lpAddress,
    stakedAmount,
    tokens,
    totalRewardRate,
    totalStakedInUSD,
    doubleRewardToken
  } = stakingInfo;
  const isDualRewards = chefVersion == 1;

  // get currencies and pair
  const { currency0, currency1, token0, token1 } = getPairRenderOrder(...tokens);

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString());
  const totalRewardRateFriendly = addCommasToNumber(totalRewardRate.toString());

  // get the color of the token
  const backgroundColor1 = useColorForToken(token0)

  // Only override `backgroundColor2` if it's a dual rewards pool
  const backgroundColor2 = useColorForToken(token1, () => isDualRewards);
  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakedAmount || stakedAmount.equalTo(ZERO)

  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()

  const lpToken = useTLP({ lpAddress, token0, token1 });

  const { userLPAmountUSDFormatted } = useUserFarmStatistics({
    lpToken,
    userLPStakedAmount: stakedAmount,
    totalPoolAmountUSD: totalStakedInUSD,
    chefVersion: chefVersion,
  }) ?? {};

  const poolHandle = `${token0.symbol}-${token1.symbol}`

  const handleDepositClick = useCallback(() => {
    if (account) {
      setShowStakingModal(true)
    } else {
      toggleWalletModal()
    }
  }, [account, toggleWalletModal])

  return (
    <PageWrapper gap="lg" justify="center">
      <RowBetween style={{ gap: '24px' }}>
        <TYPE.largeHeader >
          {poolHandle} {t('earnPage.liquidityMining')}
        </TYPE.largeHeader>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
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
            <TYPE.body fontSize={24} fontWeight={500}>
              {`${totalRewardRateFriendly}` + t('earnPage.pngPerWeek')}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {showAddLiquidityButton ? (
        <VoteCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.step1')}</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>
                  {t('earnPage.pglTokenRequired', { poolHandle })}
                </TYPE.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currency0 && currencyId(currency0)}/${currency1 && currencyId(currency1)}`}
              >
                {t('earnPage.addPoolLiquidity', { poolHandle })}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
        </VoteCard>
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
                <ResponsiveRowBetween style={{alignItems: 'baseline'}}>
                  {(isDualRewards && inStaging)
                    ? (
                      // If MasterChefV2, only show the TLP Amount (no $ amount)
                      <>
                        <AutoColumn gap="md">
                          <TYPE.white fontSize={36} fontWeight={600}>
                            {stakedAmount?.toSignificant(6) ?? '-'}
                          </TYPE.white>
                        </AutoColumn>
                        <TYPE.white>
                          TLP {poolHandle}
                        </TYPE.white>
                      </>
                    )
                    : (
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
          <StyledBottomCard dim={stakedAmount?.equalTo(ZERO)}>
            <AutoColumn gap="sm">
              <RowBetween>
                <TYPE.black>{t('earnPage.unclaimed')} TRI</TYPE.black>
                {(isDualRewards && doubleRewards) ? (
                  <TYPE.black>{t('earnPage.unclaimed')} {doubleRewardToken.symbol}</TYPE.black>
                ) : null}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <TYPE.largeHeader fontSize={36} fontWeight={600}>
                  <CountUp enabled={earnedAmount?.greaterThan(ZERO)} value={parseFloat(earnedAmount?.toFixed(6) ?? '0')} />
                </TYPE.largeHeader>
                {(isDualRewards && doubleRewards) ? (
                  <TYPE.largeHeader fontSize={36} fontWeight={600}>
                    <CountUp enabled={doubleRewardAmount?.greaterThan(ZERO)} value={parseFloat(doubleRewardAmount?.toFixed(6) ?? '0')} />
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
              disabled={userLiquidityUnstaked == null || userLiquidityUnstaked?.equalTo(ZERO)}
              width="160px"
              padding="8px"
              onClick={handleDepositClick}
            >
              {t('earnPage.depositPglTokens')}
            </ButtonPrimary>

            <ButtonPrimary
              disabled={stakedAmount == null || stakedAmount?.equalTo(ZERO)}
              padding="8px"
              borderRadius="8px"
              width="160px"
              onClick={() => setShowUnstakingModal(true)}
            >
              Withdraw
            </ButtonPrimary>

            <ButtonPrimary
              disabled={earnedAmount == null || earnedAmount?.equalTo(ZERO)}
              padding="8px"
              borderRadius="8px"
              width="160px"
              onClick={() => setShowClaimRewardModal(true)}
            >
              {t('earnPage.claim')}
            </ButtonPrimary>
          </DataRow>
        ) : null}

        {userLiquidityUnstaked?.greaterThan(ZERO) ? (
          <TYPE.main>
            {userLiquidityUnstaked.toSignificant(6)} {t('earnPage.pglTokenAvailable')}
          </TYPE.main>
        ) : null}
      </PositionInfo>
    </PageWrapper>
  )
}
