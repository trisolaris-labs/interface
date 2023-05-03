import { Trade, TradeType, Percent } from '@trisolaris/sdk'
import React, { useContext, useMemo } from 'react'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { ButtonPrimary } from '../Button'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { StableSwapTrade } from '../../state/stableswap/hooks'

const StyledMinimumReceived = styled.div`
  font-weight: 500;
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
  isRoutedViaStableSwap,
  stableSwapTrade,
  stableswapPriceImpactWithoutFee,
  isStableSwapPriceImpactSevere
}: {
  trade?: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
  isRoutedViaStableSwap: boolean
  stableSwapTrade: StableSwapTrade | undefined
  stableswapPriceImpactWithoutFee: Percent
  isStableSwapPriceImpactSevere: boolean
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])

  const priceImpactSeverity = warningSeverity(
    isRoutedViaStableSwap ? stableswapPriceImpactWithoutFee : priceImpactWithoutFee
  )

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const tradeInputAmount = isRoutedViaStableSwap ? stableSwapTrade?.inputAmount : trade?.inputAmount
  const tradeOutputAmount = isRoutedViaStableSwap ? stableSwapTrade?.outputAmount : trade?.outputAmount

  const tradeOutputAmountWithSlippage = isRoutedViaStableSwap
    ? stableSwapTrade?.outputAmountLessSlippage
    : slippageAdjustedAmounts[Field.OUTPUT]

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={tradeInputAmount?.currency} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              showAcceptChanges && (trade?.tradeType === TradeType.EXACT_OUTPUT || isRoutedViaStableSwap)
                ? theme.primary1
                : ''
            }
          >
            {tradeInputAmount?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {tradeInputAmount?.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={tradeOutputAmount?.currency} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && trade?.tradeType === TradeType.EXACT_INPUT
                ? theme.primary1
                : ''
            }
          >
            {tradeOutputAmount?.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {tradeOutputAmount?.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={'0px'}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TYPE.main color={theme.primary1}>{t('swap.priceUpdated')}</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
            >
              {t('swap.accept')}
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
        {isRoutedViaStableSwap || trade?.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {t('swap.outputEstimated')}
            {
              <StyledMinimumReceived>
                {tradeOutputAmountWithSlippage?.toSignificant(6)} {tradeOutputAmount?.currency.symbol}
              </StyledMinimumReceived>
            }
            {t('swap.transactionRevert')}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: '100%' }}>
            {t('swap.inputEstimated')}
            {
              <StyledMinimumReceived>
                {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {tradeInputAmount?.currency.symbol}
              </StyledMinimumReceived>
            }
            {t('swap.transactionRevert')}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <TYPE.main>
            {t('swap.outputSentTo')}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
