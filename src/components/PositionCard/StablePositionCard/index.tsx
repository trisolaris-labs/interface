import { Pair } from '@trisolaris/sdk'
import { darken } from 'polished'
import React, { useState, useContext } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { ButtonPrimary } from '../../Button'
import { ChevronDown, ChevronUp } from 'react-feather'
import { TokenPairBackgroundColor } from '../../earn/PoolCardTri.styles'

import { useColorWithDefault } from '../../../hooks/useColor'

import Card, { LightCard } from '../../Card'
import { AutoColumn } from '../../Column'
import { AutoRow, RowBetween, RowFixed } from '../../Row'
import { useTranslation } from 'react-i18next'

import { StableSwapPoolName, STABLESWAP_POOLS } from '../../../state/stableswap/constants'
import useStablePoolsData from '../../../hooks/useStablePoolsData'
import { BIG_INT_ZERO } from '../../../constants'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import CurrencyLogo from '../../CurrencyLogo'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'

import ContractAddress from '../../ContractAddress'
import { TYPE } from '../../../theme'
import { HelpCircle } from 'lucide-react'
import { MouseoverTooltip } from '../../Tooltip'
import { useWindowSize } from '../../../hooks/useWindowSize'

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
  word-break: break-word;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
font-size: 16px !important;
`};
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
font-size: 14px !important;
`};
`

const StyledFixedHeightRow = styled(FixedHeightRow)`
  z-index: 1;
  box-sizing: content-box;
  border: 20px solid transparent;
  margin: -20px;
  cursor: pointer;
`

const StyledMouseoverTooltip = styled(MouseoverTooltip)`
  font-size: 0.9rem;
  text-align: center;
  min-width: 360px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  min-width: 190px;
  font-size: 0.75rem;
  `};
`

const StyledContractAddress = styled(ContractAddress)`
  font-size: 16px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
font-size: 12px !important;
`};
`

const StyledViewDetails = styled(StyledText)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
display:none;
`};
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

  const { width } = useWindowSize()
  const theme = useContext(ThemeContext)

  const [stablePoolData, userData] = useStablePoolsData(poolName)
  const { disableAddLiquidity, name, tokens, friendlyName } = stablePoolData
  const { address: poolAddress, poolTokens: stablePoolTokens } = STABLESWAP_POOLS[poolName]
  const poolTokens = tokens.map(({ token }) => token)

  const currencies = stablePoolTokens.map(token => unwrappedToken(token))
  const [showMore, setShowMore] = useState(false)

  const backgroundColor1 = useColorWithDefault('#2172E5', stablePoolTokens[0])
  const backgroundColor2 = useColorWithDefault('#2172E5', stablePoolTokens[stablePoolTokens.length - 1])
  // @TODO Update styling so it can handle 3 color gradient

  const hasLPTokenBalance = userData?.lpTokenBalance?.greaterThan(BIG_INT_ZERO) ?? false

  function handleAddLiquidity() {
    push(`${pathname}/add/${name}`)
  }
  function handleRemoveLiquidity() {
    push(`${pathname}/remove/${name}`)
  }

  const formattedPoolData = [
    {
      label: 'Virtual Price',
      value: stablePoolData.virtualPrice == null ? '-' : `$${stablePoolData.virtualPrice?.toFixed(6)}`,
      tooltipData: 'Average dollar value of pool token.'
    }
  ]

  const handleCardClick = () => {
    setShowMore(!showMore)
  }

  const renderRow = ({ label, tooltipData, value }: { label: string; tooltipData?: string; value: string }) => {
    return (
      <FixedHeightRow key={label}>
        <StyledText style={{ zIndex: 1, display: 'flex' }}>
          {`${label}${tooltipData ? '' : ':'}`}
          {tooltipData && (
            <>
              <StyledMouseoverTooltip text={tooltipData} placement="top">
                <HelpCircle
                  size={width && width < theme.viewPorts.upToExtraSmall ? 14 : 20}
                  style={{ cursor: 'pointer', position: 'absolute', margin: '0 2px 0 5px' }}
                />
              </StyledMouseoverTooltip>
            </>
          )}
        </StyledText>

        <StyledText fontWeight={500}>{value}</StyledText>
      </FixedHeightRow>
    )
  }

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor1} id={`stableswap-position-card-${name}`}>
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />
      <AutoColumn gap="10px">
        <StyledFixedHeightRow onClick={handleCardClick} id={`stableswap-compact-clickable-position-card-${name}`}>
          <RowFixed>
            <MultipleCurrencyLogo currencies={currencies} size={20} />
            <StyledPoolName fontWeight={500} fontSize={20} marginLeft={30}>
              {friendlyName}
            </StyledPoolName>
          </RowFixed>

          <RowFixed justify="flex-end" gap="8px">
            <StyledViewDetails fontWeight={500}>{showMore ? 'Hide Details' : 'View Details'}</StyledViewDetails>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </StyledFixedHeightRow>

        {userData?.lpTokenBalance.greaterThan(BIG_INT_ZERO) ? (
          <AutoColumn gap="8px">
            <FixedHeightRow marginTop="4px">
              <StyledText fontWeight={500}>User {friendlyName} LP Balance</StyledText>
              <StyledText fontWeight={500}>{`$${userData?.usdBalance.toFixed(4)} (${userData?.lpTokenBalance.toFixed(
                3
              )} LP tokens) `}</StyledText>
            </FixedHeightRow>
          </AutoColumn>
        ) : null}

        {showMore && (
          <div style={{ marginTop: '14px' }}>
            <AutoColumn gap="8px">
              <TYPE.subHeader fontSize={16} fontWeight={600}>
                Currency Reserves
              </TYPE.subHeader>
              {stablePoolData.tokens.map(({ token, percent, value }) => (
                <FixedHeightRow key={token.name}>
                  <div>
                    <CurrencyLogo size="20px" style={{ marginRight: '8px' }} currency={unwrappedToken(token)} />
                    {token.name}
                  </div>
                  <StyledText fontWeight={500} marginLeft={'6px'}>
                    {`${value.toSignificant(4)} (${percent.toFixed(2)}%)`}
                  </StyledText>
                </FixedHeightRow>
              ))}

              <TYPE.subHeader fontSize={16} fontWeight={600} marginTop="8px">
                Pool Info
              </TYPE.subHeader>
              {formattedPoolData.map(({ label, value, tooltipData }) => renderRow({ label, value, tooltipData }))}

              <TYPE.subHeader fontSize={16} fontWeight={600} marginTop="8px">
                Contracts
              </TYPE.subHeader>
              <AutoColumn gap="8px">
                <FixedHeightRow>
                  <StyledText>{stablePoolData.lpToken?.name} LP Token</StyledText>
                  <StyledContractAddress address={stablePoolData.lpToken?.address} />
                </FixedHeightRow>
                <FixedHeightRow>
                  <StyledText>{friendlyName} Pool Contract</StyledText>
                  <StyledContractAddress address={poolAddress} />
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
            <AutoColumn gap="8px" style={{ marginTop: '10px' }}>
              <ButtonRow>
                <ButtonPrimary
                  disabled={disableAddLiquidity}
                  id="stableswap-add-liquidity-button"
                  width="45%"
                  onClick={handleAddLiquidity}
                >
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
