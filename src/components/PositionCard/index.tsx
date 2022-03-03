import React, { useState } from 'react'
import { JSBI, Percent, Fraction } from '@trisolaris/sdk'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../Button'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useColorWithDefault } from '../../hooks/useColor'
import { getPairRenderOrder } from '../../utils/pools'
import useGetTokenPrice from '../../hooks/useGetTokenPrice'

import { currencyId } from '../../utils/currencyId'

import { BIG_INT_ZERO } from '../../constants'
import { PositionCardProps } from './PositionCard.types'

import { TokenPairBackgroundColor } from '../earn/PoolCardTri.styles'

import { ManageButton, FixedHeightRow, StyledPositionCard } from './PositionCard.styles'

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined
  const { currency0, currency1, token0, token1 } = getPairRenderOrder(pair?.token0, pair?.token1)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const backgroundColor1 = useColorWithDefault('#2172E5', token0)
  const backgroundColor2 = useColorWithDefault('#2172E5', token1)

  // const token0Price = useGetTokenPrice(token0.address)
  // const token1Price = useGetTokenPrice(token1.address)

  // const token0Deposits =
  //   token0Deposited?.multiply(token0Price?.adjusted ?? JSBI.BigInt(1)) ?? new Fraction(BIG_INT_ZERO)
  // const token1Deposits =
  //   token1Deposited?.multiply(token1Price?.adjusted ?? JSBI.BigInt(1)) ?? new Fraction(BIG_INT_ZERO)

  // const totalDeposits = token0Deposits.add(token1Deposits)


  return (
    <StyledPositionCard border={border} bgColor={backgroundColor1}>
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>{t('positionCard.loading')}</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </RowFixed>

          <RowFixed gap="8px">
            <ManageButton
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  {' '}
                  {t('positionCard.manage')}
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  {t('positionCard.manage')}
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ManageButton>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('positionCard.poolTokens')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                Your deposits
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {/* {totalDeposits.greaterThan(BIG_INT_ZERO) ? `$${totalDeposits.toSignificant(6)}` : '-'} */}
              </Text>
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('positionCard.pooled')} {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('positionCard.pooled')} {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('positionCard.poolShare')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <ButtonPrimary
                padding="8px"
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="48%"
              >
                {t('positionCard.add')}
              </ButtonPrimary>
              <ButtonPrimary
                padding="8px"
                as={Link}
                width="48%"
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                {t('positionCard.remove')}
              </ButtonPrimary>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
