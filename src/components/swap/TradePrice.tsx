import React from 'react'
import { JSBI, Price, Trade } from '@trisolaris/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import { StableSwapTrade } from '../../state/stableswap/hooks'

interface TradePriceProps {
  trade?: Trade | StableSwapTrade
  isRoutedViaStableSwap: boolean
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ trade, showInverted, setShowInverted, isRoutedViaStableSwap }: TradePriceProps) {
  const theme = useContext(ThemeContext)
  const formatExecutionPrice = () => {
    if (isRoutedViaStableSwap) {
      if (
        JSBI.equal(trade?.executionPrice?.raw?.numerator ?? JSBI.BigInt(0), JSBI.BigInt(0)) ||
        JSBI.equal(trade?.executionPrice?.raw?.denominator ?? JSBI.BigInt(0), JSBI.BigInt(0))
      ) {
        return
      }
      return !showInverted
        ? trade?.executionPrice?.raw?.invert()?.toSignificant(6)
        : trade?.executionPrice?.raw?.toSignificant(6)
    }
    return !showInverted ? trade?.executionPrice?.invert()?.toSignificant(6) : trade?.executionPrice?.toSignificant(6)
  }
  const formattedExecutionPrice = formatExecutionPrice()

  const show = Boolean(trade?.executionPrice?.baseCurrency && trade?.executionPrice?.quoteCurrency)
  const label = showInverted
    ? `${trade?.executionPrice?.quoteCurrency?.symbol} per ${trade?.executionPrice?.baseCurrency?.symbol}`
    : `${trade?.executionPrice?.baseCurrency?.symbol} per ${trade?.executionPrice?.quoteCurrency?.symbol}`

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          {formattedExecutionPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
