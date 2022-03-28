import { Percent, Trade, TradeType } from '@trisolaris/sdk'
import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { useTranslation } from 'react-i18next'

import { useDerivedStableSwapInfo } from '../../state/stableswap/hooks'

function TradeSummary({
  trade,
  stableswapPriceImpactWithoutFee,
  allowedSlippage,
  isRoutedViaStableSwap,
  isStableSwapPriceImpactSevere
}: {
  trade: Trade
  stableswapPriceImpactWithoutFee: Percent
  allowedSlippage: number
  isRoutedViaStableSwap: boolean
  isStableSwapPriceImpactSevere: boolean
}) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const { stableswapTrade } = useDerivedStableSwapInfo()
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { t } = useTranslation()

  const receivedAmountEstimate = isRoutedViaStableSwap
    ? `${stableswapTrade?.outputAmountLessSlippage.toSignificant(4)} ${
        stableswapTrade?.outputAmountLessSlippage.currency.symbol
      }` ?? '-'
    : isExactIn
    ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ?? '-'
    : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'

  return (
    <>
      <AutoColumn gap="4px" style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {isExactIn ? t('swap.minimumReceived') : t('swap.maximumSold')}
            </TYPE.black>
            {/* <QuestionHelper text={t('swap.transactionRevertHelper')} /> */}
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text1} fontSize={14}>
              {receivedAmountEstimate}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {t('swap.priceImpact')}
            </TYPE.black>
            {/* <QuestionHelper text={t('swap.priceImpactHelper')} /> */}
          </RowFixed>
          <FormattedPriceImpact
            isStableSwapPriceImpactSevere={isStableSwapPriceImpactSevere}
            priceImpact={isRoutedViaStableSwap ? stableswapPriceImpactWithoutFee : priceImpactWithoutFee}
            isRoutedViaStableSwap={isRoutedViaStableSwap}
          />
        </RowBetween>

        {!isRoutedViaStableSwap && (
          <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                {t('swap.liquidityProviderFee')}
              </TYPE.black>
              {/* <QuestionHelper text={t('swap.liquidityProviderHelper')} /> */}
            </RowFixed>
            <TYPE.black fontSize={14} color={theme.text1}>
              {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
            </TYPE.black>
          </RowBetween>
        )}

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {t('swap.routedViaAmmType')}
            </TYPE.black>
          </RowFixed>
          <TYPE.black id={'swap-routed-via'} fontSize={14} color={theme.text1}>
            {isRoutedViaStableSwap ? 'Stable AMM' : 'Default AMM'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
  stableswapPriceImpactWithoutFee: Percent
  isRoutedViaStableSwap: boolean
  isStableSwapPriceImpactSevere: boolean
}

export function AdvancedSwapDetails({
  trade,
  isRoutedViaStableSwap,
  stableswapPriceImpactWithoutFee,
  isStableSwapPriceImpactSevere
}: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = !isRoutedViaStableSwap && Boolean(trade && trade.route.path.length > 2)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary
            isRoutedViaStableSwap={isRoutedViaStableSwap}
            trade={trade}
            stableswapPriceImpactWithoutFee={stableswapPriceImpactWithoutFee}
            allowedSlippage={allowedSlippage}
            isStableSwapPriceImpactSevere={isStableSwapPriceImpactSevere}
          />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('swap.route')}
                  </TYPE.black>
                  {/* <QuestionHelper text={t('swap.routingHelper')} /> */}
                </RowFixed>

                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
