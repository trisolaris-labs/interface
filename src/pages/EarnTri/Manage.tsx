import React, { useCallback, useMemo, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { JSBI, TokenAmount, CETH, Token, WETH, ChainId } from '@trisolaris/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModalTri'
import UnstakingModal from '../../components/earn/UnstakingModalTri'
import ClaimRewardModal from '../../components/earn/ClaimRewardModalTri'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColorWithDefault } from '../../hooks/useColor'
import { CountUp } from 'use-count-up'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { BIG_INT_ZERO, PNG } from '../../constants'
import { useTranslation } from 'react-i18next'
import { useSingleFarm } from '../../state/stake/user-farms'
import useUserFarmStatistics from '../../state/stake/useUserFarmStatistics'
import { PageWrapper } from '../../components/Page'
import { Card } from 'rebass'
import { DarkGreyCard } from '../../components/Card'
import { addCommasToNumber } from '../../utils'

const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  max-width: 640px;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

const StyledDataCard = styled(DataCard)<{ bgColor?: any; showBackground?: any }>`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
  z-index: 2;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: ${({ theme, bgColor, showBackground }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
`

const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: -40px;
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
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

const Wrapper = styled(Card) < { bgColor1: string | null, bgColor2?: string | null, showBackground: boolean }>`
  border: ${({ showBackground, theme }) =>
    showBackground ? `1px solid ${theme.primary1}` : `1px solid ${theme.bg3};`
  }
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr;
  gap: 12px;
  box-shadow: ${({ showBackground, theme }) =>
    showBackground ? `0px 0px 8px 5px ${theme.primary1}` : `0 2px 8px 0 ${theme.bg3}`
  }
`

const VoteCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
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
     flex-direction: column;
     gap: 12px;
   `};
`

export default function Manage({
  match: {
    params: { currencyIdA, currencyIdB, version }
  }
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; version: string }>) {
  const { account } = useActiveWeb3React()

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
  const stakingInfo = useSingleFarm(Number(version))

  let backgroundColor1: string
  let token: Token | undefined

  const totalStakedInUSD = addCommasToNumber(stakingInfo.totalStakedInUSD.toString());
  const totalRewardRate = addCommasToNumber(stakingInfo.totalRewardRate.toString());

  // get the color of the token
  backgroundColor1 = useColorWithDefault('#2172E5', token);

  // detect existing unstaked LP position to show add button if none found
  const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
  const showAddLiquidityButton = Boolean(stakingInfo?.stakedAmount?.equalTo('0') && userLiquidityUnstaked?.equalTo('0'))

  // toggle for staking modal and unstaking modal
  const [showStakingModal, setShowStakingModal] = useState(false)
  const [showUnstakingModal, setShowUnstakingModal] = useState(false)
  const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

  // fade cards if nothing staked or nothing earned yet
  const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))

  const countUpAmount = stakingInfo?.earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  const countUpAmount2 = stakingInfo?.doubleRewardAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious2 = usePrevious(countUpAmount2) ?? '0'
  const chefVersion = stakingInfo.chefVersion
  const doubleRewardsOn = stakingInfo.doubleRewards
  const inStaging = stakingInfo.inStaging

  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()

  const lpToken = useMemo(() => {
    return new Token(
      ChainId.AURORA,
      stakingInfo.lpAddress,
      18,
      'TLP',
      `TLP ${currencyA?.symbol}-${currencyB?.symbol}`,
    );
  }, [currencyA?.symbol, currencyB?.symbol, stakingInfo.lpAddress]);

  const { userLPAmountUSDFormatted } = useUserFarmStatistics({
    lpToken,
    userLPStakedAmount: stakingInfo?.stakedAmount,
    totalPoolAmountUSD: stakingInfo?.totalStakedInUSD,
    chefVersion: stakingInfo?.chefVersion,
  }) ?? {};

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
        <TYPE.largeHeader style={{ margin: 0 }}>
          {currencyA?.symbol}-{currencyB?.symbol} {t('earnPage.liquidityMining')}
        </TYPE.largeHeader>
        <DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
      </RowBetween>

      <DataRow style={{ gap: '24px' }}>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.subHeader style={{ margin: 0 }}>{t('earnPage.totalStaked')}</TYPE.subHeader>
            <TYPE.body fontSize={24} fontWeight={500}>
              {`$${totalStakedInUSD}`}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
        <PoolData>
          <AutoColumn gap="sm">
            <TYPE.subHeader style={{ margin: 0 }}>{t('earnPage.poolRate')}</TYPE.subHeader>
            <TYPE.body fontSize={24} fontWeight={500}>
              {`${totalRewardRate}` + t('earnPage.pngPerWeek')}
            </TYPE.body>
          </AutoColumn>
        </PoolData>
      </DataRow>

      {/* @TODO */}
      {showAddLiquidityButton && (
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>{t('earnPage.step1')}</TYPE.white>
              </RowBetween>
              <RowBetween style={{ marginBottom: '1rem' }}>
                <TYPE.white fontSize={14}>
                  {t('earnPage.pglTokenRequired', { poolHandle: currencyA?.symbol + '-' + currencyB?.symbol })}
                </TYPE.white>
              </RowBetween>
              <ButtonPrimary
                padding="8px"
                width={'fit-content'}
                as={Link}
                to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
              >
                {t('earnPage.addPoolLiquidity', { poolHandle: currencyA?.symbol + '-' + currencyB?.symbol })}
              </ButtonPrimary>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
      )}

      {/* @TODO */}
      {stakingInfo && (
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
      )}

      <PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
        <BottomSection gap="lg" justify="center">
          <Wrapper disabled={disableTop} bgColor1={backgroundColor1} bgColor2={null} showBackground={!showAddLiquidityButton}>
            <CardSection>
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontWeight={600}>{t('earnPage.liquidityDeposits')}</TYPE.white>
                </RowBetween>
                <RowBetween style={{ alignItems: 'baseline' }}>
                 {/* <AutoColumn gap="md">
                    <TYPE.white fontSize={36} fontWeight={600}>
                      {userLPAmountUSDFormatted ?? '$0'}
                    </TYPE.white>
                  </AutoColumn>
                  <TYPE.white>
                    {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'} TLP {currencyA?.symbol}-{currencyB?.symbol}
                  </TYPE.white> */}

                  {(chefVersion == 1 && inStaging )
                    ? (
                      // If MasterChefV2, only show the TLP Amount (no $ amount)
                      <>
                        <AutoColumn gap="md">
                          <TYPE.white fontSize={36} fontWeight={600}>
                            {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
                          </TYPE.white>
                        </AutoColumn>
                        <TYPE.white>
                          TLP {currencyA?.symbol}-{currencyB?.symbol}
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
                          {stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'} TLP {currencyA?.symbol}-{currencyB?.symbol}
                        </TYPE.white>
                      </>
                    )}
                </RowBetween>
              </AutoColumn>
            </CardSection>
          </Wrapper>
          <StyledBottomCard dim={stakingInfo?.stakedAmount?.equalTo(JSBI.BigInt(0))}>
            <AutoColumn gap="sm">
              <RowBetween>
                <div>
                  <TYPE.black>{t('earnPage.unclaimed')} TRI</TYPE.black>
                </div>
                {(chefVersion == 1 && doubleRewardsOn) && (
                <div>
                  <TYPE.black>{t('earnPage.unclaimed')} AURORA</TYPE.black>
                </div>
                )}
              </RowBetween>
              <RowBetween style={{ alignItems: 'baseline' }}>
                <TYPE.largeHeader fontSize={36} fontWeight={600}>
                  {/* Create component so this works */}
                  <CountUp
                    key={countUpAmount}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpAmountPrevious)}
                    end={parseFloat(countUpAmount)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TYPE.largeHeader>
                {(chefVersion==1 && doubleRewardsOn) && (
                <TYPE.largeHeader fontSize={36} fontWeight={600}>
                  <CountUp
                    key={countUpAmount2}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpAmountPrevious2)}
                    end={parseFloat(countUpAmount2)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                </TYPE.largeHeader>
                )}
              </RowBetween>
            </AutoColumn>
          </StyledBottomCard>
        </BottomSection>

        {!showAddLiquidityButton && (
          <DataRow style={{ marginBottom: '1rem' }}>
            <ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
              {t('earnPage.depositPglTokens')}
            </ButtonPrimary>

            {stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
              <>
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  width="160px"
                  onClick={() => setShowUnstakingModal(true)}
                >
                  Withdraw
                </ButtonPrimary>
              </>
            )}

            {stakingInfo?.earnedAmount && JSBI.notEqual(BIG_INT_ZERO, stakingInfo?.earnedAmount?.raw) && (
              <ButtonPrimary
                padding="8px"
                borderRadius="8px"
                width="160px"
                onClick={() => setShowClaimRewardModal(true)}
              >
                {t('earnPage.claim')}
              </ButtonPrimary>
            )}
          </DataRow>
        )}
        {!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
          <TYPE.main>
            {userLiquidityUnstaked.toSignificant(6)} {t('earnPage.pglTokenAvailable')}
          </TYPE.main>
        )}
      </PositionInfo>
    </PageWrapper>
  )
}
