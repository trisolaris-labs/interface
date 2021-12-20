import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { CETH, Token } from '@trisolaris/sdk'
import { ButtonPrimary } from '../Button'
import { AutoRow } from '../Row'
import { StakingTri, StakingTriFarms, StakingTriStakedAmounts } from '../../state/stake/stake-constants'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { PNG } from '../../constants'
import { useTranslation } from 'react-i18next'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const AprContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn) <{ showBackground: boolean; bgColor1: any; bgColor2?: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: 1;
  background: ${({ theme, bgColor1, bgColor2, showBackground }) =>
    bgColor2 != null
      ? `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor1} 30%, ${bgColor2} 70%, ${showBackground ? theme.black : theme.bg5} 100%)`
      : `radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor1} 0%, ${showBackground ? theme.black : theme.bg5} 100%) `};
  background-color: grey;
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
     0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
     grid-template-columns: 48px 1fr auto;
   `};
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

const GREY_ICON_TOKENS = ['ETH', 'WETH', 'WBTC', 'WNEAR'];

export default function PoolCard({ stakingInfo, version }: { stakingInfo: StakingTri; version: number }) {
  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const { t } = useTranslation()
  const isStaking = Boolean(stakingInfo?.stakedAmount?.greaterThan('0') ?? false)

  const token: Token =
    currency0 === CETH || currency1 === CETH
      ? currency0 === CETH
        ? token1
        : token0
      : token0.equals(PNG[token0.chainId])
        ? token1
        : token0

  // get the color of the token
  let backgroundColor1 = useColor(token)
  const secondaryToken = token === token1 ? token0 : token1;
  let backgroundColor2 = useColor(secondaryToken);

  const totalStakedInUSD = stakingInfo.totalStakedInUSD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const isDualRewards = stakingInfo.chefVersion == 1

  // Colors are dynamically chosen based on token logos
  // These tokens are mostly grey; Override color to blue

  if (GREY_ICON_TOKENS.includes(token?.symbol ?? '')) {
    backgroundColor1 = '#2172E5';
  }

  // Only override `backgroundColor2` if it's a dual rewards pool
  if (isDualRewards && GREY_ICON_TOKENS.includes(secondaryToken?.symbol ?? '')) {
    backgroundColor2 = '#2172E5';
  }

  return (
    <Wrapper showBackground={isStaking} bgColor1={backgroundColor1} bgColor2={isDualRewards ? backgroundColor2 : null}>
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
        <AutoRow align="baseline">
          <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '8px' }}>
            {currency0.symbol}-{currency1.symbol}
          </TYPE.white>
          {isDualRewards ? (
            <TYPE.white fontWeight={600} fontSize={16} style={{ marginLeft: '8px' }}>
              Dual Rewards
            </TYPE.white>
          ) : null}
        </AutoRow>
        {(isStaking || !stakingInfo.isPeriodFinished) && (
          <StyledInternalLink
            to={`/tri/${currencyId(currency0)}/${currencyId(currency1)}/${version}`}
            style={{ width: '100%' }}
          >
            <ButtonPrimary padding="8px" borderRadius="8px">
              {isStaking ? t('earn.manage') : t('earn.deposit')}
            </ButtonPrimary>
          </StyledInternalLink>
        )}
      </TopSection>

      <StatContainer>
          <RowBetween>
            <TYPE.white> {t('earn.totalStaked')}</TYPE.white>
            <TYPE.white>{`$${totalStakedInUSD}`}</TYPE.white>
          </RowBetween>
      </StatContainer>
      {isDualRewards ? (
        <AprContainer>
          <RowBetween>
            <TYPE.white>TRI APR</TYPE.white>
            <TYPE.white>{`${stakingInfo.apr}%`}</TYPE.white>
          </RowBetween>
          <RowBetween>
            <TYPE.white>AURORA APR</TYPE.white>
            <TYPE.white>{`${stakingInfo.apr2}%`}</TYPE.white>
          </RowBetween>
        </AprContainer>
      ) : (
        <AprContainer>
          <RowBetween>
            <TYPE.white>TRI APR</TYPE.white>
            <TYPE.white>{`${stakingInfo.apr}%`}</TYPE.white>
          </RowBetween>
        </AprContainer>
      )}
      <StatContainer>
        {/*<RowBetween>
          <TYPE.white> {t('earn.poolWeight')} </TYPE.white>
          <TYPE.white>{`${stakingInfo.multiplier}X`}</TYPE.white>
        </RowBetween>*/}
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          {/*<BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>{t('earn.yourRate')}</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {`${stakingInfo.rewardRate
                ?.multiply(`${60 * 60 * 24 * 7}`)
                ?.toSignificant(4, { groupSeparator: ',' })} PNG / week`}
            </TYPE.black>
          </BottomSection>*/}
        </>
      )}
    </Wrapper>
  )
}
