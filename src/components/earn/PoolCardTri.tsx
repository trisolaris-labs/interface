import React from 'react'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Token, TokenAmount } from '@trisolaris/sdk'
import { ButtonPrimary } from '../Button'
import { AutoRow, RowBetween } from '../Row'
import { ChefVersions } from '../../state/stake/stake-constants'
import { useColorForToken } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { useTranslation } from 'react-i18next'
import Card from '../Card'
import { useHistory } from 'react-router-dom'
import { addCommasToNumber } from '../../utils'
import { lighten } from 'polished'
import { TokenPairBackgroundColor } from './styled'
import { getPairRenderOrder, isTokenAmountPositive } from '../../utils/pools'

const Wrapper = styled(Card)<{ bgColor1: string | null; bgColor2?: string | null; isDoubleRewards: boolean }>`
  border: ${({ isDoubleRewards, theme }) =>
    isDoubleRewards ? `1px solid ${theme.primary1}` : `1px solid ${theme.bg3};`};
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  box-shadow: ${({ isDoubleRewards, theme }) =>
    isDoubleRewards ? `0px 0px 8px 5px ${theme.primary1}` : `0 2px 8px 0 ${theme.bg3}`};
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToSmall`
        grid-template-rows: auto 1fr;
        padding: .75rem;
  `};
`

const PairContainer = styled.div`
  display: flex;
  align-items: center;
`

const ResponsiveCurrencyLabel = styled(TYPE.white)`
  font-size: 20 !important;
  margin-left: 0.5rem !important;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 14 !important;
    `};
`

type Props = {
  apr: number
  apr2: number
  doubleRewards: boolean
  chefVersion: ChefVersions
  inStaging: boolean
  noTriRewards: boolean
  isLegacy?: boolean
  isPeriodFinished: boolean
  stakedAmount: TokenAmount | null
  token0: Token
  token1: Token
  totalStakedInUSD: number
  version: number
  doubleRewardToken: Token
}

const Button = styled(ButtonPrimary)<{ isStaking: boolean }>`
  background: ${({ isStaking, theme }) => (isStaking ? theme.black : theme.primary1)};
  padding: 8px;
  border-radius: 10px;
  max-width: 80px;
  ${({ isStaking, theme }) =>
    isStaking &&
    `
        &:focus, &:hover, &:active {
            background-color: ${lighten(0.12, theme.black)};
        }
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 4px;
        border-radius: 5px;
    `};
`

export default function PoolCardTRI({
  apr,
  apr2,
  chefVersion,
  doubleRewards,
  inStaging,
  noTriRewards,
  isLegacy,
  isPeriodFinished,
  stakedAmount,
  token0: _token0,
  token1: _token1,
  totalStakedInUSD,
  version,
  doubleRewardToken
}: Props) {
  const { currency0, currency1, token0, token1 } = getPairRenderOrder(_token0, _token1)

  const { t } = useTranslation()
  const isStaking = isTokenAmountPositive(stakedAmount)

  const history = useHistory()
  const isDualRewards = chefVersion == 1

  // get the color of the token
  const backgroundColor1 = useColorForToken(token0)

  // Only override `backgroundColor2` if it's a dual rewards pool
  const backgroundColor2 = useColorForToken(token1, () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())
  return (
    <Wrapper bgColor1={backgroundColor1} bgColor2={backgroundColor2} isDoubleRewards={doubleRewards}>
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoRow justifyContent="space-between">
        <PairContainer>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
          <ResponsiveCurrencyLabel>
            {currency0.symbol}-{currency1.symbol}
          </ResponsiveCurrencyLabel>
        </PairContainer>
        {isLegacy && !isStaking ? (
          <Button disabled={true} isStaking={isStaking}>
            {t('earn.deposit')}
          </Button>
        ) : (
          <Button
            disabled={(isStaking || !isPeriodFinished) === false}
            isStaking={isStaking}
            onClick={() => {
              history.push(`/tri/${currencyId(currency0)}/${currencyId(currency1)}/${version}`)
            }}
          >
            {isStaking ? t('earn.manage') : t('earn.deposit')}
          </Button>
        )}
      </AutoRow>

      <RowBetween>
        <AutoColumn>
          <TYPE.mutedSubHeader>{t('earn.totalStaked')}</TYPE.mutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </AutoColumn>
        <AutoColumn>
          <TYPE.mutedSubHeader textAlign="end">APR</TYPE.mutedSubHeader>
          <TYPE.white textAlign="end">
            {isDualRewards && doubleRewards && !inStaging
              ? `${apr}% TRI + ${`${apr2}%`} ${`${doubleRewardToken.symbol}`}`
              : inStaging
              ? `Coming Soon`
              : noTriRewards
              ? `${`${apr2}%`} ${`${doubleRewardToken.symbol}`}`
              : `${apr}%`}
          </TYPE.white>
        </AutoColumn>
      </RowBetween>
    </Wrapper>
  )
}
