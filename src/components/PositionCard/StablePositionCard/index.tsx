import { ChainId, Pair } from '@trisolaris/sdk'
import { darken } from 'polished'
import React, { useState } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { ButtonEmpty, ButtonPrimary } from '../../Button'
import { ChevronDown, ChevronUp } from 'react-feather'
import { TokenPairBackgroundColor } from '../../earn/PoolCardTri.styles'

import { useColorWithDefault } from '../../../hooks/useColor'

import Card, { LightCard } from '../../Card'
import { AutoColumn } from '../../Column'
import DoubleCurrencyLogo from '../../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../../Row'
import { useTranslation } from 'react-i18next'

import { StableSwapPoolName, STABLESWAP_POOLS } from '../../../state/stableswap/constants'
import TripleCurrencyLogo from '../../TripleCurrencyLogo'
import useStablePoolsData from '../../../hooks/useStablePoolsData'
import { BIG_INT_ZERO } from '../../../constants'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import CurrencyLogo from '../../CurrencyLogo'

import ContractAddress from '../../ContractAddress'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  background-color: unset;
  border: none;
  position: relative;
  overflow: hidden;
`

const ButtonRow = styled(AutoRow)`
  gap: 8px;
  justify-content: space-evenly;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

const StyledText = styled(Text)`
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 12px;
  max-width: 180px;
`};
`

const StyledPoolName = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
font-size: 16px !important;
`};
`

const StyledFixedHeightRow = styled(FixedHeightRow)`
  z-index: 99;
  padding-top: 35px;
  margin-top: -20px;
  padding-bottom: 35px;
  margin-bottom: -20px;
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

interface StablePositionCardProps {
  poolName: StableSwapPoolName
  showUnwrapped?: boolean
  border?: string
}

export default function FullStablePositionCard({ poolName, border }: StablePositionCardProps) {
  const { t } = useTranslation()
  const {
    location: { pathname },
    push
  } = useHistory()

  const { name, poolTokens, address: poolAddress } = STABLESWAP_POOLS[ChainId.AURORA][poolName]

  const [token0, token1, token2] = poolTokens
  const [currency0, currency1, currency2] = poolTokens.map(token => unwrappedToken(token))
  const [showMore, setShowMore] = useState(false)

  const backgroundColor1 = useColorWithDefault('#2172E5', token0)
  const backgroundColor2 = useColorWithDefault('#2172E5', token1)
  // @TODO Update styling so it can handle 3 color gradient
  const backgroundColor3 = useColorWithDefault('#2172E5', token2)

  const [stablePoolData, userData] = useStablePoolsData(poolName)
  const hasLPTokenBalance = userData?.lpTokenBalance?.greaterThan(BIG_INT_ZERO) ?? false

  function handleAddLiquidity() {
    push(`${pathname}/add/${name}`)
  }
  function handleRemoveLiquidity() {
    push(`${pathname}/remove/${name}`)
  }

  const formattedPoolTokenData = stablePoolData.tokens.map(({ token, percent, value }) => ({
    label: token.name,
    token,
    value: `${value.toString()} (${percent.toFixed(2)}%)`
  }))

  const formattedPoolData = [
    {
      label: 'Virtual Price',
      value: stablePoolData.virtualPrice == null ? '-' : `$${stablePoolData.virtualPrice?.toFixed(6)}`
    },
    {
      label: 'Amplification coefficient',
      value: stablePoolData.aParameter?.toString() ?? '-'
    },
    {
      label: 'Swap Fee',
      value: stablePoolData.swapFee == null ? '-' : `${stablePoolData.swapFee?.toString()}%`
    },
    {
      label: 'Admin Fee',
      value: stablePoolData.adminFee == null ? '-' : `${stablePoolData.adminFee?.toString()}%`
    }
  ]

  const handleCardClick = () => {
    setShowMore(!showMore)
  }

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor1}>
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoColumn id={`stableswap-position-card-${name}`} gap="8px">
        <StyledFixedHeightRow onClick={handleCardClick}>
          <RowFixed>
            {currency2 != null ? (
              <TripleCurrencyLogo
                currency0={currency0}
                currency1={currency1}
                currency2={currency2}
                margin={true}
                size={20}
              />
            ) : (
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            )}
            <StyledPoolName fontWeight={500} fontSize={20}>
              {name}
            </StyledPoolName>
          </RowFixed>

          <RowFixed justify="flex-end" gap="8px">
            {stablePoolData?.lpToken != null ? (
              <StyledText textAlign="end" fontWeight={500}>
                {`${userData?.lpTokenBalance.toFixed(6) ?? 0} ${stablePoolData.lpToken?.name}`}
              </StyledText>
            ) : null}
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </StyledFixedHeightRow>

        {showMore && (
          <div style={{ marginTop: '10px' }}>
            <AutoColumn gap="8px">
              {formattedPoolData.slice(0, 1).map(({ label, value }) => (
                <FixedHeightRow key={label}>
                  <StyledText fontWeight={500}>{label}:</StyledText>
                  <StyledText fontWeight={500}>{value}</StyledText>
                </FixedHeightRow>
              ))}
              <FixedHeightRow>
                <div>Token Address:</div>
                <ContractAddress address={stablePoolData.lpToken?.address} />
              </FixedHeightRow>
              <FixedHeightRow>
                <div>Pool Address:</div>
                <ContractAddress address={poolAddress} />
              </FixedHeightRow>
            </AutoColumn>
            <AutoColumn gap="8px">
              <AutoColumn gap="8px" style={{ margin: '10px 0' }}>
                {formattedPoolTokenData.map(({ label, token, value }) => (
                  <React.Fragment key={label}>
                    <FixedHeightRow>
                      <div>
                        <CurrencyLogo size="20px" style={{ marginRight: '8px' }} currency={unwrappedToken(token)} />
                        {label}
                      </div>
                      <StyledText fontWeight={500} marginLeft={'6px'}>
                        {value}
                      </StyledText>
                    </FixedHeightRow>
                  </React.Fragment>
                ))}
              </AutoColumn>

              {formattedPoolData.slice(1).map(({ label, value }) => (
                <FixedHeightRow key={label}>
                  <StyledText fontWeight={500}>{label}:</StyledText>
                  <StyledText fontWeight={500}>{value}</StyledText>
                </FixedHeightRow>
              ))}
            </AutoColumn>
            <AutoColumn gap="8px" style={{ marginTop: '10px' }}>
              <ButtonRow>
                <ButtonPrimary id="stableswap-add-liquidity-button" width="45%" onClick={handleAddLiquidity}>
                  Add
                </ButtonPrimary>
                <ButtonPrimary
                  id="stableswap-remove-liquidity-button"
                  disabled={!hasLPTokenBalance}
                  width="45%"
                  onClick={handleRemoveLiquidity}
                >
                  Remove
                </ButtonPrimary>
              </ButtonRow>
            </AutoColumn>
          </div>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
