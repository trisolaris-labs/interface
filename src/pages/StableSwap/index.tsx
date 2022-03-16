import { ChainId, JSBI, Percent, Token, Trade } from '@trisolaris/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import Card, { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Row'
import { ChevronWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'
import spacemenAndPlanets from '../../assets/svg/spacemen_and_planets.svg'

import { INITIAL_ALLOWED_SLIPPAGE, BIG_INT_ZERO } from '../../constants'
import { USDC, USDT } from '../../constants/tokens'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useStableSwapCallback } from '../../hooks/useStableSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/stableswap/actions'
import {
  isStableSwapHighPriceImpact,
  StableSwapTrade,
  useDefaultsFromURLSearch,
  useDerivedStableSwapInfo,
  useStableSwapActionHandlers,
  useStableSwapState
} from '../../state/stableswap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'
import Settings from '../../components/Settings'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'

const NATIVE_USDC = USDC[ChainId.AURORA]
const NATIVE_USDT = USDT[ChainId.AURORA]

const Root = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
`

const SwapContainer = styled.div`
  display: flex;
  flex: 1 1 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 420px;
  height: 100%;
`

const IconContainer = styled.div`
  margin-right: 10em;

  ${({ theme }) => theme.mediaWidth.upToMedium`
      display: none;
  `};
  ${({ theme }) => theme.mediaWidth.upToLarge`
        & > * {
            height: 400px;
        }
  `};
`

const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default function StableSwap() {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token && ![NATIVE_USDC.address, NATIVE_USDT.address].includes(c.address)
      ) ?? [],
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
  const isExpertMode = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useStableSwapState()
  const {
    priceImpact,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError,
    stableSwapTrade
  } = useDerivedStableSwapInfo()

  // TODO: NOTE - Unsure if numerator and denominator are correct for price impact calculation as it is ported over
  const priceImpactWithoutFee = useMemo(
    // multiply price impact by negative one for porting
    // priceImpact is supposed to be 18 decimals formatted, so we use that as the numerator
    // for the denominator, we use 100 * 18 decimals?
    () =>
      new Percent(
        JSBI.lessThan(priceImpact, JSBI.BigInt(0)) ? JSBI.multiply(priceImpact, JSBI.BigInt(-1)) : priceImpact,
        JSBI.multiply(JSBI.BigInt(100), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      ),
    [priceImpact]
  )

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const trade = showWrap ? undefined : stableSwapTrade

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useStableSwapActionHandlers()
  const isValid = !inputError
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
    tradeToConfirm: StableSwapTrade | undefined
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

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO)
  )
  const noRoute = false

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(
    stableSwapTrade?.inputAmount,
    stableSwapTrade?.contract?.address
  )

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

  const { callback: swapCallback, error: swapCallbackError } = useStableSwapCallback(stableSwapTrade, allowedSlippage)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        console.log('handleswap hash: ', hash)
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch(error => {
        console.log('handleswap error: ', error)
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, showConfirm, swapCallback, priceImpactWithoutFee])

  // warnings on slippage
  const priceImpactSeverity = isStableSwapHighPriceImpact(priceImpact)
  const showPriceImpactError = (priceImpactSeverity && !isExpertMode)
  // console.log({
  //   priceImpactWithoutFee,
  //   priceImpact: priceImpact?.toString(),
  //   priceImpactSeverity
  // })

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !inputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity === true && !isExpertMode)

  // @nocommit add this later
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  // @nocommit will this occur?
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

  // @nocommit This is hacky.  Replace this with new redux state
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(
  //     replaceStableSwapState({
  //       typedValue: '0',
  //       field: Field.INPUT,
  //       inputCurrencyId: USDT[ChainId.AURORA].address,
  //       recipient: null
  //     })
  //   )
  // }, [dispatch])

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />

      <Root>
        <IconContainer>
          <img height="500px" src={spacemenAndPlanets} />
        </IconContainer>
        <SwapContainer>
          <AppBody>
            {/* <SwapPoolTabs active={'swap'} /> */}
            <Wrapper id="swap-page">
              <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade as Trade | undefined}
                originalTrade={tradeToConfirm as Trade | undefined}
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
                  <TYPE.largeHeader>StableSwap</TYPE.largeHeader>
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
                  isStableSwap={true}
                  stableSwapInputField={Field.INPUT}
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
                  isStableSwap={true}
                  stableSwapInputField={Field.OUTPUT}
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
                        (priceImpactSeverity === true && !isExpertMode)
                      }
                      error={isValid && priceImpactSeverity === true}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {priceImpactSeverity === true && !isExpertMode
                          ? t('swapPage.priceImpactHigh')
                          : t('swapPage.swap') + `${priceImpactSeverity === true ? t('swapPage.anyway') : ''}`}
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
                    disabled={!isValid || (priceImpactSeverity === true && !isExpertMode) || !!swapCallbackError}
                    error={isValid && priceImpactSeverity === true && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {inputError
                        ? inputError
                        : priceImpactSeverity === true && !isExpertMode
                        ? t('swapPage.priceImpactHigh')
                        : t('swapPage.swap') + `${priceImpactSeverity === true ? t('swapPage.anyway') : ''}`}
                    </Text>
                  </ButtonError>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                {/* @nocommit betterTradeLinkVersion ? (
                  <BetterTradeLink version={betterTradeLinkVersion} />
                ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                  <DefaultVersionLink />
                ) : null */}
              </BottomGrouping>
            </Wrapper>
          </AppBody>
          {/* <AdvancedSwapDetailsDropdown trade={trade} /> */}
        </SwapContainer>
      </Root>
    </>
  )
}
