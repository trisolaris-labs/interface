import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { ThemeContext } from 'styled-components'
import { JSBI, Percent, Token, Trade } from '@trisolaris/sdk'
import { ChevronDown } from 'react-feather'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import BetterTradeLink, { DefaultVersionLink } from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ChevronWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'
import spacemenAndPlanets from '../../assets/svg/spacemen_and_planets.svg'
import { DeprecatedWarning } from '../../components/Warning'
import Settings from '../../components/Settings'
import AppBody from '../AppBody'
import Loader from '../../components/Loader'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import useENS from '../../hooks/useENS'
import { useIsSelectedAEBToken } from '../../state/lists/hooks'

import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'

import { Field } from '../../state/swap/actions'
import { INITIAL_ALLOWED_SLIPPAGE, BIG_INT_ZERO } from '../../constants'

import { ClickableText } from '../Pool/styleds'
import { LinkStyledButton, TYPE } from '../../theme'
import { WarningWrapper, Root, SwapContainer, IconContainer, HeadingContainer } from './Swap.styles'
import { isStableSwapHighPriceImpact, useDerivedStableSwapInfo } from '../../state/stableswap/hooks'
import { useStableSwapCallback } from '../../hooks/useStableSwapCallback'

export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    isStableSwap,
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: defaultswapInputError
  } = useDerivedSwapInfo()
  const {
    priceImpact: stableswapPriceImpact,
    inputError: stableswapInputError,
    stableSwapTrade
  } = useDerivedStableSwapInfo()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENS(recipient)
  const toggledVersion = useToggledVersion()
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion]
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION]

  const betterTradeLinkVersion: Version | undefined = undefined

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
          },
    [parsedAmount, independentField, showWrap, trade]
  )

  const isRoutedViaStableSwap: boolean =
    useMemo(() => {
      const swapOutputRaw = parsedAmounts?.OUTPUT?.raw
      if (swapOutputRaw) {
        if (isStableSwap) {
          return stableSwapTrade?.outputAmount?.greaterThan(swapOutputRaw)
        }
        return false
      }
      return false
    }, [isStableSwap, , stableSwapTrade, parsedAmounts]) ?? false

  const swapInputError = isRoutedViaStableSwap ? stableswapInputError : defaultswapInputError
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO)
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const { getMaxInputAmount } = useCurrencyInputPanel()
  const { atMaxAmount: atMaxAmountInput, atHalfAmount: atHalfAmountInput, getClickedAmount } = getMaxInputAmount({
    amount: currencyBalances[Field.INPUT],
    parsedAmount: parsedAmounts[Field.INPUT]
  })

  // the callback to execute the swap
  const { callback: swapCallback, error: defaultswapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)
  const { callback: stableswapCallback, error: stableswapCallbackError } = useStableSwapCallback(
    stableSwapTrade,
    allowedSlippage
  )

  const swapCallbackError = isRoutedViaStableSwap ? stableswapCallbackError : defaultswapCallbackError

  const { priceImpactWithoutFee: defaultPriceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const stableswapPriceImpactWithoutFee = useMemo(
    // multiply price impact by negative one for porting
    // priceImpact is supposed to be 18 decimals formatted, so we use that as the numerator
    // for the denominator, we use 100 * 18 decimals?
    () =>
      new Percent(
        JSBI.lessThan(stableswapPriceImpact, JSBI.BigInt(0))
          ? JSBI.multiply(stableswapPriceImpact, JSBI.BigInt(-1))
          : stableswapPriceImpact,
        JSBI.multiply(JSBI.BigInt(100), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      ),
    [stableswapPriceImpact]
  )

  const priceImpactWithoutFee = isRoutedViaStableSwap ? stableswapPriceImpactWithoutFee : defaultPriceImpactWithoutFee

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback || !stableswapCallback) {
      return
    }

    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    const swapOrStableSwapCallback = isRoutedViaStableSwap ? stableswapCallback : swapCallback

    swapOrStableSwapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [trade?.inputAmount?.currency?.symbol, trade?.outputAmount?.currency?.symbol, Version.v2].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [
    tradeToConfirm,
    account,
    priceImpactWithoutFee,
    recipient,
    recipientAddress,
    showConfirm,
    swapCallback,
    trade,
    isRoutedViaStableSwap,
    stableswapCallback
  ])

  // errors
  // const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const defaultswapPriceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const stableswapPriceImpactSeverity = isStableSwapHighPriceImpact(stableswapPriceImpact)
  const isStableSwapPriceImpactSevere = stableswapPriceImpactSeverity === true

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !defaultswapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(!isExpertMode && (isRoutedViaStableSwap ? isStableSwapPriceImpactSevere : defaultswapPriceImpactSeverity > 3))

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(
    value => {
      const amount = getClickedAmount(value)
      onUserInput(Field.INPUT, amount)
    },
    [getClickedAmount, onUserInput]
  )

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const isAEBToken = useIsSelectedAEBToken()

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />

      {isAEBToken && (
        <WarningWrapper>
          <DeprecatedWarning />
        </WarningWrapper>
      )}

      <Root>
        <IconContainer>
          <img height="500px" src={spacemenAndPlanets} />
        </IconContainer>
        <SwapContainer>
          <AppBody>
            <SwapPoolTabs active={'swap'} />
            <Wrapper id="swap-page">
              <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
              />
              <AutoColumn gap={'md'}>
                <HeadingContainer>
                  <TYPE.largeHeader>Swap</TYPE.largeHeader>
                  <Settings />
                </HeadingContainer>

                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap && trade
                      ? t('swapPage.fromEstimated')
                      : t('swapPage.from')
                  }
                  value={formattedAmounts[Field.INPUT]}
                  disableHalfButton={atHalfAmountInput}
                  disableMaxButton={atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onClickBalanceButton={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                />
                <AutoColumn justify="space-between">
                  <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                    <ChevronWrapper height={30} width={30} clickable>
                      <ChevronDown
                        size="24"
                        onClick={() => {
                          setApprovalSubmitted(false) // reset 2 step UI for approvals
                          onSwitchTokens()
                        }}
                        color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                      />
                    </ChevronWrapper>
                    {recipient === null && !showWrap && isExpertMode ? (
                      <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                        {t('swapPage.addSend')}
                      </LinkStyledButton>
                    ) : null}
                  </AutoRow>
                </AutoColumn>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap && trade
                      ? t('swapPage.toEstimated')
                      : t('swapPage.to')
                  }
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />

                {recipient !== null && !showWrap ? (
                  <>
                    <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                      <ChevronWrapper height={30} width={30} clickable={false}>
                        <ChevronDown size="24" color={theme.text2} />
                      </ChevronWrapper>
                      <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                        {t('swapPage.removeSend')}
                      </LinkStyledButton>
                    </AutoRow>
                    <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                  </>
                ) : null}

                {showWrap ? null : (
                  <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                    <AutoColumn gap="4px">
                      {Boolean(trade) && (
                        <RowBetween align="center">
                          <Text fontWeight={500} fontSize={14} color={theme.text2}>
                            {t('swapPage.price')}
                          </Text>
                          {/* TODO: use execution price? */}
                          {/* <TradePrice
                            price={trade?.executionPrice}
                            showInverted={showInverted}
                            setShowInverted={setShowInverted}
                          /> */}
                        </RowBetween>
                      )}
                      {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                        <RowBetween align="center">
                          <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                            {t('swapPage.slippageTolerance')}
                          </ClickableText>
                          <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                            {allowedSlippage / 100}%
                          </ClickableText>
                        </RowBetween>
                      )}
                    </AutoColumn>
                  </Card>
                )}
              </AutoColumn>
              <BottomGrouping>
                {!account ? (
                  <ButtonLight onClick={toggleWalletModal}>{t('swapPage.connectWallet')}</ButtonLight>
                ) : showWrap ? (
                  <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP
                        ? t('swapPage.wrap')
                        : wrapType === WrapType.UNWRAP
                        ? t('swapPage.unwrap')
                        : null)}
                  </ButtonPrimary>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <TYPE.main mb="4px">{t('swapPage.insufficientLiquidity')}</TYPE.main>
                  </GreyCard>
                ) : showApproveFlow ? (
                  <RowBetween>
                    <ButtonConfirmed
                      onClick={approveCallback}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={approval === ApprovalState.APPROVED}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t('swapPage.approving')} <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                        t('swapPage.approved')
                      ) : (
                        t('swapPage.approve') + currencies[Field.INPUT]?.symbol
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap()
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined
                          })
                        }
                      }}
                      width="48%"
                      id="swap-button"
                      disabled={
                        !isValid ||
                        approval !== ApprovalState.APPROVED ||
                        (!isExpertMode &&
                          (isRoutedViaStableSwap ? isStableSwapPriceImpactSevere : defaultswapPriceImpactSeverity > 3))
                      }
                      error={isValid && defaultswapPriceImpactSeverity > 2}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {defaultswapPriceImpactSeverity > 3 && !isExpertMode
                          ? t('swapPage.priceImpactHigh')
                          : t('swapPage.swap') +
                            `${
                              isRoutedViaStableSwap
                                ? isStableSwapPriceImpactSevere
                                : defaultswapPriceImpactSeverity > 2
                                ? t('swapPage.anyway')
                                : ''
                            }`}
                      </Text>
                    </ButtonError>
                  </RowBetween>
                ) : (
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined
                        })
                      }
                    }}
                    id="swap-button"
                    disabled={
                      !isValid ||
                      (!isExpertMode &&
                        (isRoutedViaStableSwap ? isStableSwapPriceImpactSevere : defaultswapPriceImpactSeverity > 3)) ||
                      !!swapCallbackError
                    }
                    error={
                      isValid &&
                      (isRoutedViaStableSwap ? isStableSwapPriceImpactSevere : defaultswapPriceImpactSeverity > 2) &&
                      !swapCallbackError
                    }
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {swapInputError
                        ? swapInputError
                        : defaultswapPriceImpactSeverity > 3 && !isExpertMode
                        ? t('swapPage.priceImpactHigh')
                        : t('swapPage.swap') +
                          `${
                            (isRoutedViaStableSwap
                            ? isStableSwapPriceImpactSevere
                            : defaultswapPriceImpactSeverity > 2)
                              ? t('swapPage.anyway')
                              : ''
                          }`}
                    </Text>
                  </ButtonError>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                {betterTradeLinkVersion ? (
                  <BetterTradeLink version={betterTradeLinkVersion} />
                ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                  <DefaultVersionLink />
                ) : null}
              </BottomGrouping>
            </Wrapper>
          </AppBody>
          <AdvancedSwapDetailsDropdown trade={trade} isRoutedViaStableSwap={isRoutedViaStableSwap} />
        </SwapContainer>
      </Root>
    </>
  )
}
