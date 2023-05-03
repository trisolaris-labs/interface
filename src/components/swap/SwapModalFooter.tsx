import { Trade, TradeType, Percent } from '@trisolaris/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { useTranslation } from 'react-i18next'
import { StableSwapTrade } from '../../state/stableswap/hooks'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
  isRoutedViaStableSwap,
  stableswapPriceImpactWithoutFee,
  isStableSwapPriceImpactSevere,
  stableSwapTrade
}: {
  trade?: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
  stableswapPriceImpactWithoutFee: Percent
  isRoutedViaStableSwap: boolean
  isStableSwapPriceImpactSevere: boolean
  stableSwapTrade?: StableSwapTrade
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])

  const severity = warningSeverity(isRoutedViaStableSwap ? stableswapPriceImpactWithoutFee : priceImpactWithoutFee)
  const { t } = useTranslation()

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            {t('swap.price')} {isRoutedViaStableSwap && ` (Slippage Tolerance)`}
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            {formatExecutionPrice(isRoutedViaStableSwap ? stableSwapTrade : trade, showInverted, isRoutedViaStableSwap)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {trade?.tradeType === TradeType.EXACT_INPUT || isRoutedViaStableSwap
                ? t('swap.minimumReceived')
                : t('swap.maximumSold')}
            </TYPE.black>
            <QuestionHelper text={t('swap.transactionRevertHelper')} />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>
              {isRoutedViaStableSwap
                ? stableSwapTrade?.outputAmountLessSlippage.toSignificant(4)
                : trade?.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              {isRoutedViaStableSwap
                ? stableSwapTrade?.outputAmount.currency.symbol
                : trade?.tradeType === TradeType.EXACT_INPUT
                ? trade?.outputAmount.currency.symbol
                : trade?.inputAmount.currency.symbol}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              {t('swap.priceImpact')}
            </TYPE.black>
            <QuestionHelper text={t('swap.priceImpactHelper')} />
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
              <QuestionHelper text={t('swap.liquidityProviderHelper')} />
            </RowFixed>
            <TYPE.black fontSize={14}>
              {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade?.inputAmount.currency.symbol : '-'}
            </TYPE.black>
          </RowBetween>
        )}

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400}>
              {t('swap.routedViaAmmType')}
            </TYPE.black>
          </RowFixed>
          <TYPE.black
            id={'swap-routed-via-confirmation'}
            color={isRoutedViaStableSwap ? theme.metallicGold : theme.yellow2}
            fontSize={14}
          >{`${isRoutedViaStableSwap ? 'Stable' : 'Standard'} AMM`}</TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: '10px 0 0 0' }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? t('swap.swapAnyway') : t('swap.confirmSwap')}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
