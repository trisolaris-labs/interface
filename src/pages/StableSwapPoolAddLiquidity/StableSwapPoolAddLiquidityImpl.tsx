import React, { useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Text } from 'rebass'

import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/stableswap-add-liquidity/actions'
import {
  useAddLiquidityPriceImpact,
  useDerivedStableSwapAddLiquidityInfo,
  useStableSwapAddLiquidityActionHandlers,
  useStableSwapAddLiquidityCallback,
  useStableSwapAddLiquidityState
} from '../../state/stableswap-add-liquidity/hooks'
import AppBody from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { useTranslation } from 'react-i18next'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { StableSwapPoolName } from '../../state/stableswap/constants'
import { basisPointsToPercent, divideCurrencyAmountByNumber, replaceUnderscoresWithSlashes } from '../../utils'
import StableSwapPoolAddLiquidityApprovalsRow from './StableSwapPoolAddLiquidityApprovalsRow'
import { TYPE } from '../../theme'
import { HeadingContainer } from '../Swap/Swap.styles'
import { AutoRow } from '../../components/Row'
import CaptionWithIcon from '../../components/CaptionWithIcon'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween } from '../../components/Row'
import { JSBI } from '@trisolaris/sdk'
import { BIG_INT_ZERO, PRICE_IMPACT_ERROR_THRESHOLD_NEGATIVE } from '../../constants'
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import confirmStableSwapAddLiquiditySlippage from './confirmStableSwapAddLiquiditySlippage'
import StableSwapAddLiquiditySlippage from './StableSwapAddLiquiditySlippage'

type Props = {
  stableSwapPoolName: StableSwapPoolName
}

export default function StableSwapPoolAddLiquidityImpl({ stableSwapPoolName }: Props) {
  const { t } = useTranslation()
  const { account, chainId, library } = useActiveWeb3React()
  const [poolData, _userShareData] = useStablePoolsData(stableSwapPoolName)
  const [allowedSlippage] = useUserSlippageTolerance()
  const { isBonus, isHighImpact, minToMint, priceImpact } = useAddLiquidityPriceImpact(
    stableSwapPoolName,
    poolData.virtualPrice
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // mint state
  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2,
    [Field.CURRENCY_3]: typedValue3,
    [Field.CURRENCY_4]: typedValue4
  } = useStableSwapAddLiquidityState()
  const {
    currencies,
    currencyBalances,
    parsedAmounts,
    error,
    hasThirdCurrency,
    hasFourthCurrency,
    hasFifthCurrency
  } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)

  const {
    onField0Input,
    onField1Input,
    onField2Input,
    onField3Input,
    onField4Input
  } = useStableSwapAddLiquidityActionHandlers()

  const [isExpertMode] = useExpertModeManager()

  const amountsAreNotZero = Object.values(parsedAmounts).some(parsedAmount =>
    JSBI.greaterThan(parsedAmount ? parsedAmount.raw : BIG_INT_ZERO, BIG_INT_ZERO)
  )
  const isValid = !error

  // @TODO Add Loading Animation/behavior
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const { callback: addLiquidityCallback, txHash, setTxHash } = useStableSwapAddLiquidityCallback(stableSwapPoolName)

  // get the max amounts user can add
  const { getMaxAmounts } = useCurrencyInputPanel()
  const { maxAmounts, atMaxAmounts, atHalfAmounts } = getMaxAmounts({ currencyBalances, parsedAmounts })

  async function onAdd() {
    if (!chainId || !library || !account) {
      return
    }

    if (
      priceImpact != null &&
      !confirmStableSwapAddLiquiditySlippage(
        priceImpact?.lessThan(JSBI.BigInt(0)) ? priceImpact?.multiply(JSBI.BigInt(-1)) : priceImpact, // Make +ve for comparison
        basisPointsToPercent(allowedSlippage) // Normalise user's slippage tolerance to compare to price impact percentage
      )
    ) {
      return
    }

    setAttemptingTxn(true)
    addLiquidityCallback()
      .then((_response: any) => {
        setAttemptingTxn(false)

        ReactGA.event({
          category: 'Liquidity',
          action: 'Add',
          label: stableSwapPoolName
        })
      })
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)

    onField0Input('')
    onField1Input('')
    onField2Input('')
    onField3Input('')
    onField4Input('')

    setTxHash('')
  }, [onField0Input, onField1Input, onField2Input, onField3Input, onField4Input, setTxHash])

  const pendingText = `Supplying ${Object.values(parsedAmounts)
    .map(amount => (amount ? `${amount?.toSignificant(6)} ${amount?.currency.symbol}  ` : ''))
    .join('')}`

  const modalHeader = () => {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        {Object.values(parsedAmounts).map(parsedAmount => {
          const { currency } = parsedAmount || {}

          return parsedAmount ? (
            <RowBetween align="flex-end" key={currency?.symbol}>
              <Text fontSize={24} fontWeight={500}>
                {parsedAmount.toExact()}
              </Text>
              <RowFixed gap="4px">
                <CurrencyLogo currency={currency} size={'24px'} />
                <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                  {currency?.symbol}
                </Text>
              </RowFixed>
            </RowBetween>
          ) : null
        })}
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ButtonPrimary onClick={() => onAdd()}>
        <Text fontWeight={500} fontSize={20}>
          Confirm
        </Text>
      </ButtonPrimary>
    )
  }

  const isSlippageGreaterThanFivePercent =
    priceImpact != null && priceImpact.lessThan(PRICE_IMPACT_ERROR_THRESHOLD_NEGATIVE)

  return (
    <>
      <AppBody>
        <AddRemoveTabs creating={false} adding={true} isStablePool />
        <Wrapper>
          <AutoColumn id="stableswap-add-liquidity" gap="20px">
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash ? txHash : ''}
              content={() => (
                <ConfirmationModalContent
                  title={'You will supply'}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
            <HeadingContainer>
              <AutoRow justify="center">
                <TYPE.mediumHeader>{replaceUnderscoresWithSlashes(poolData.name)}</TYPE.mediumHeader>
                <CaptionWithIcon>Stable pools on Trisolaris support uneven deposits</CaptionWithIcon>
              </AutoRow>
            </HeadingContainer>
            <CurrencyInputPanel
              disableCurrencySelect
              value={typedValue0}
              onUserInput={onField0Input}
              onClickBalanceButton={value => {
                const amount = maxAmounts[Field.CURRENCY_0]
                onField0Input(
                  (value === BalanceButtonValueEnum.MAX
                    ? amount
                    : divideCurrencyAmountByNumber(amount, 2)
                  )?.toExact() ?? ''
                )
              }}
              disableHalfButton={atHalfAmounts[Field.CURRENCY_0]}
              disableMaxButton={atMaxAmounts[Field.CURRENCY_0]}
              currency={currencies[Field.CURRENCY_0]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <CurrencyInputPanel
              disableCurrencySelect
              value={typedValue1}
              onUserInput={onField1Input}
              onClickBalanceButton={value => {
                const amount = maxAmounts[Field.CURRENCY_1]
                onField1Input(
                  (value === BalanceButtonValueEnum.MAX
                    ? amount
                    : divideCurrencyAmountByNumber(amount, 2)
                  )?.toExact() ?? ''
                )
              }}
              disableHalfButton={atHalfAmounts[Field.CURRENCY_1]}
              disableMaxButton={atMaxAmounts[Field.CURRENCY_1]}
              currency={currencies[Field.CURRENCY_1]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {hasThirdCurrency ? (
              <CurrencyInputPanel
                disableCurrencySelect
                value={typedValue2}
                onUserInput={onField2Input}
                onClickBalanceButton={value => {
                  const amount = maxAmounts[Field.CURRENCY_2]
                  onField2Input(
                    (value === BalanceButtonValueEnum.MAX
                      ? amount
                      : divideCurrencyAmountByNumber(amount, 2)
                    )?.toExact() ?? ''
                  )
                }}
                disableHalfButton={atHalfAmounts[Field.CURRENCY_2]}
                disableMaxButton={atMaxAmounts[Field.CURRENCY_2]}
                currency={currencies[Field.CURRENCY_2]}
                id="add-liquidity-input-token2"
                showCommonBases
              />
            ) : null}
            {hasFourthCurrency ? (
              <CurrencyInputPanel
                disableCurrencySelect
                value={typedValue3}
                onUserInput={onField3Input}
                onClickBalanceButton={value => {
                  const amount = maxAmounts[Field.CURRENCY_3]
                  onField3Input(
                    (value === BalanceButtonValueEnum.MAX
                      ? amount
                      : divideCurrencyAmountByNumber(amount, 2)
                    )?.toExact() ?? ''
                  )
                }}
                disableHalfButton={atHalfAmounts[Field.CURRENCY_3]}
                disableMaxButton={atMaxAmounts[Field.CURRENCY_3]}
                currency={currencies[Field.CURRENCY_3]}
                id="add-liquidity-input-token3"
                showCommonBases
              />
            ) : null}
            {hasFifthCurrency ? (
              <CurrencyInputPanel
                disableCurrencySelect
                value={typedValue4}
                onUserInput={onField4Input}
                onClickBalanceButton={value => {
                  const amount = maxAmounts[Field.CURRENCY_4]
                  onField4Input(
                    (value === BalanceButtonValueEnum.MAX
                      ? amount
                      : divideCurrencyAmountByNumber(amount, 2)
                    )?.toExact() ?? ''
                  )
                }}
                disableHalfButton={atHalfAmounts[Field.CURRENCY_4]}
                disableMaxButton={atMaxAmounts[Field.CURRENCY_4]}
                currency={currencies[Field.CURRENCY_4]}
                id="add-liquidity-input-token4"
                showCommonBases
              />
            ) : null}
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('addLiquidity.connectWallet')}</ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                <RowBetween>
                  <StableSwapAddLiquiditySlippage
                    bonus={isBonus}
                    errorThreshold={PRICE_IMPACT_ERROR_THRESHOLD_NEGATIVE}
                    isHighImpact={isHighImpact}
                    priceImpact={priceImpact}
                  />
                  <AutoColumn>Min. LP Tokens: {minToMint?.toFixed(5) ?? '-'}</AutoColumn>
                </RowBetween>
                <StableSwapPoolAddLiquidityApprovalsRow stableSwapPoolName={stableSwapPoolName}>
                  <ButtonError
                    id={'add-liquidity-supply-button'}
                    onClick={() => {
                      isExpertMode ? onAdd() : setShowConfirm(true)
                    }}
                    disabled={!amountsAreNotZero || !isValid || isSlippageGreaterThanFivePercent}
                    error={(amountsAreNotZero && !isValid) || isSlippageGreaterThanFivePercent}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {((isSlippageGreaterThanFivePercent && 'Slippage too high, contact us') || error) ??
                        t('addLiquidity.supply')}
                    </Text>
                  </ButtonError>
                </StableSwapPoolAddLiquidityApprovalsRow>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
