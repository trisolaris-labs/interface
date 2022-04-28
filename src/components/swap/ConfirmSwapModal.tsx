import { currencyEquals, Trade, Percent } from '@trisolaris/sdk'
import React, { useCallback, useMemo } from 'react'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'
import { useTranslation } from 'react-i18next'

import { useDerivedStableSwapInfo } from '../../state/stableswap/hooks'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  stableswapPriceImpactWithoutFee,
  isRoutedViaStableSwap,
  isStableSwapPriceImpactSevere
}: {
  isOpen: boolean
  trade: Trade | undefined
  originalTrade: Trade | undefined
  attemptingTxn: boolean
  txHash: string | undefined
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage: string | undefined
  onDismiss: () => void

  stableswapPriceImpactWithoutFee: Percent
  isRoutedViaStableSwap: boolean
  isStableSwapPriceImpactSevere: boolean
}) {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )
  const { t } = useTranslation()

  const { stableswapTrade } = useDerivedStableSwapInfo()

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
        isRoutedViaStableSwap={isRoutedViaStableSwap}
        stableSwapTrade={stableswapTrade}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, isRoutedViaStableSwap, stableswapTrade])

  const modalBottom = useCallback(() => {
    return trade || stableswapTrade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        allowedSlippage={allowedSlippage}
        isRoutedViaStableSwap={isRoutedViaStableSwap}
        stableswapPriceImpactWithoutFee={stableswapPriceImpactWithoutFee}
        isStableSwapPriceImpactSevere={isStableSwapPriceImpactSevere}
        stableSwapTrade={stableswapTrade}
      />
    ) : null
  }, [
    trade,
    stableswapTrade,
    onConfirm,
    showAcceptChanges,
    swapErrorMessage,
    allowedSlippage,
    isRoutedViaStableSwap,
    stableswapPriceImpactWithoutFee,
    isStableSwapPriceImpactSevere
  ])

  const currentTrade = isRoutedViaStableSwap ? stableswapTrade : trade
  // text to show while loading
  const pendingText = `Swapping ${currentTrade?.inputAmount?.toSignificant(6)} ${
    currentTrade?.inputAmount?.currency?.symbol
  } for ${currentTrade?.outputAmount?.toSignificant(6)} ${currentTrade?.outputAmount?.currency?.symbol}`

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={t('swap.confirmSwap')}
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage, t]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
