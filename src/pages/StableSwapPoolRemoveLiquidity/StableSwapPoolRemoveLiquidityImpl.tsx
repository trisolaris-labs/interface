import { JSBI } from '@trisolaris/sdk'
import React, { useEffect, useRef, useState, useContext, useCallback } from 'react'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import { ButtonLight, ButtonConfirmed, ButtonError } from '../../components/Button'
import CaptionWithIcon from '../../components/CaptionWithIcon'
import { DarkGreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { PageWrapper } from '../../components/Page'
import { AutoRow, RowBetween } from '../../components/Row'
import { BIG_INT_ZERO } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import useStableSwapEstimateRemoveLiquidity from '../../hooks/useStableSwapEstimateRemoveLiquidity'
import useStableSwapRemoveLiquidity from '../../hooks/useStableSwapRemoveLiquidity'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { tryParseAmount } from '../../state/stableswap/hooks'
import { TYPE } from '../../theme'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { Dots } from '../Pool/styleds'
import StableSwapRemoveCurrencyRow from './StableSwapRemoveLiquidityCurrencyRow'
import StableSwapRemoveLiquidityInputPanel from './StableSwapRemoveLiquidityInputPanel'
import StableSwapRemoveLiquidityTokenSelector from './StableSwapRemoveLiquidityTokenSelector'

import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import { RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { ThemeContext } from 'styled-components'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'
import { ButtonPrimary } from '../../components/Button'
import { useExpertModeManager } from '../../state/user/hooks'
import Settings from '../../components/Settings'
import { replaceUnderscoresWithSlashes } from '../../utils'
import BackButton from '../../components/BackButton'

const INPUT_CHAR_LIMIT = 18

type Props = {
  stableSwapPoolName: StableSwapPoolName
}

export default function StableSwapPoolAddLiquidity({ stableSwapPoolName }: Props) {
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
  const [input, _setInput] = useState<string>('')

  // If this is `null`, withdraw all tokens evenly, otherwise withdraw to the selected token index
  const [withdrawTokenIndex, setWithdrawTokenIndex] = useState<number | null>(null)
  const withdrawTokenIndexRef = useRef(withdrawTokenIndex)
  const [poolData, userShareData] = useStablePoolsData(stableSwapPoolName)
  const pool = STABLESWAP_POOLS[stableSwapPoolName]
  const { address, lpToken, metaSwapAddresses } = pool
  const effectiveAddress = isMetaPool(stableSwapPoolName) ? metaSwapAddresses : address
  const currency = unwrappedToken(lpToken)

  const { account } = useActiveWeb3React()

  const parsedAmount = tryParseAmount(input, currency)
  const parsedAmountString = parsedAmount?.raw?.toString() ?? null
  const rawParsedAmountRef = useRef(parsedAmountString)

  const [estimatedAmounts, estimateRemovedLiquidityTokenAmounts, error] = useStableSwapEstimateRemoveLiquidity({
    amount: parsedAmount,
    stableSwapPoolName,
    withdrawTokenIndex
  })

  useEffect(() => {
    if (parsedAmountString == null) {
      return
    }

    if (withdrawTokenIndexRef.current !== withdrawTokenIndex || rawParsedAmountRef.current !== parsedAmountString) {
      withdrawTokenIndexRef.current = withdrawTokenIndex
      rawParsedAmountRef.current = parsedAmountString

      void estimateRemovedLiquidityTokenAmounts()
    }
  }, [estimateRemovedLiquidityTokenAmounts, withdrawTokenIndex, parsedAmountString, error])

  const { getMaxInputAmount } = useCurrencyInputPanel()
  const { atMaxAmount: atMaxAmountInput, atHalfAmount: atHalfAmountInput, getClickedAmount } = getMaxInputAmount({
    amount: userShareData?.lpTokenBalance,
    parsedAmount
  })

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT)
    _setInput(value)
  }

  const handleBalanceClick = (value: BalanceButtonValueEnum) => {
    const amount = getClickedAmount(value)
    _setInput(amount)
  }
  const [userSlippageTolerance] = useUserSlippageTolerance()

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, effectiveAddress)
  const { removeLiquidity: handleRemoveLiquidity, attemptingTxn, txHash, setTxHash } = useStableSwapRemoveLiquidity({
    amount: parsedAmount,
    estimatedAmounts,
    withdrawTokenIndex,
    stableSwapPoolName,
    userSlippageTolerance
  })

  function renderApproveButton() {
    return (
      <ButtonConfirmed
        id="remove-liquidity-approve-button"
        mr="0.5rem"
        onClick={handleApproval}
        confirmed={approvalState === ApprovalState.APPROVED}
        disabled={approvalState !== ApprovalState.NOT_APPROVED}
      >
        {approvalState === ApprovalState.PENDING ? (
          <Dots>Approving</Dots>
        ) : approvalState === ApprovalState.APPROVED ? (
          'Approved'
        ) : (
          'Approve'
        )}
      </ButtonConfirmed>
    )
  }

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const [isExpertMode] = useExpertModeManager()

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        {estimatedAmounts.map(currencyAmount => {
          const { currency } = currencyAmount

          return currencyAmount.greaterThan(BIG_INT_ZERO) ? (
            <React.Fragment key={currency.symbol}>
              <RowBetween align="flex-end" key={currency.symbol}>
                <Text fontSize={24} fontWeight={500}>
                  {currencyAmount.toSignificant(6)}
                </Text>
                <RowFixed gap="4px">
                  <CurrencyLogo currency={currency} size={'24px'} />
                  <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
                    {currency.symbol}
                  </Text>
                </RowFixed>
              </RowBetween>
            </React.Fragment>
          ) : null
        })}

        <TYPE.italic fontSize={12} color={theme.text2} textAlign="left" padding={'12px 0 0 0'}>
          {/*TODO: Translate using i18n*/}
          {`Output is estimated. If the price changes by more than ${userSlippageTolerance /
            100}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  function modalBottom() {
    return (
      <>
        <RowBetween>
          <Text color={theme.text2} fontWeight={500} fontSize={16}>
            {/*TODO: Translate using i18n*/}
            {`${lpToken.symbol} Burned`}
          </Text>
          <RowFixed>
            <MultipleCurrencyLogo currencies={estimatedAmounts.map(currencyAmount => currencyAmount.currency)} margin />
            <Text fontWeight={500} fontSize={16}>
              {parsedAmount?.toSignificant(6)}
            </Text>
          </RowFixed>
        </RowBetween>
        <ButtonPrimary disabled={approvalState === ApprovalState.NOT_APPROVED} onClick={handleRemoveLiquidity}>
          <Text fontWeight={500} fontSize={20}>
            Confirm
          </Text>
        </ButtonPrimary>
      </>
    )
  }

  const pendingText = `Burning ${parsedAmount?.toSignificant(6)} ${lpToken.symbol} for ${estimatedAmounts
    .filter(amount => amount.greaterThan(BIG_INT_ZERO))
    .map(amount => `${amount.toSignificant(6)} ${amount.currency.symbol}`)
    .join(', ')}`

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    if (txHash) {
      setInput('0')
    }
    setTxHash('')
  }, [setInput, txHash])

  const hasZeroInput = JSBI.equal(parsedAmount?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

  return (
    <PageWrapper gap="lg" justify="center">
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash ? txHash : ''}
        content={() => (
          <ConfirmationModalContent
            title={t('removeLiquidity.youWillReceive')}
            onDismiss={handleDismissConfirmation}
            topContent={modalHeader}
            bottomContent={modalBottom}
          />
        )}
        pendingText={pendingText}
      />
      <AutoColumn style={{ width: '100%' }}>
        <DarkGreyCard>
          <AutoColumn gap="20px">
            <AutoRow justify="space-between">
              <BackButton fallbackPath="/pool/stable" />
              <TYPE.mediumHeader>
                Remove Liquidity from {replaceUnderscoresWithSlashes(poolData.name)}
              </TYPE.mediumHeader>
              <Settings />
            </AutoRow>
            <StableSwapRemoveLiquidityInputPanel
              id="stableswap-remove-liquidity"
              value={input}
              onUserInput={setInput}
              stableSwapPoolName={stableSwapPoolName}
              onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
              onClickBalanceButton={handleBalanceClick}
              disableMaxButton={atMaxAmountInput}
              disableHalfButton={atHalfAmountInput}
            />
            <div>
              <AutoRow justify="flex-start">
                <StableSwapRemoveLiquidityTokenSelector
                  stableSwapPoolName={stableSwapPoolName}
                  tokenIndex={withdrawTokenIndex}
                  onSelectTokenIndex={setWithdrawTokenIndex}
                />
              </AutoRow>
              <AutoRow marginLeft="4px">
                <CaptionWithIcon>Choose how you would like to receive your withdrawn tokens</CaptionWithIcon>
              </AutoRow>
            </div>

            {estimatedAmounts.map((currencyAmount, i) => {
              const { currency } = currencyAmount
              return (
                <StableSwapRemoveCurrencyRow
                  index={i}
                  currency={currency}
                  key={currency.symbol}
                  value={currencyAmount.toExact()}
                />
              )
            })}
          </AutoColumn>
          <div style={{ marginTop: '1rem' }}>
            {account == null ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <RowBetween>
                {renderApproveButton()}
                <ButtonError
                  id={'stableswap-remove-liquidity-button'}
                  error={!hasZeroInput && error != null}
                  disabled={approvalState !== ApprovalState.APPROVED || hasZeroInput}
                  onClick={() => {
                    isExpertMode ? handleRemoveLiquidity() : setShowConfirm(true)
                  }}
                >
                  {!hasZeroInput && error != null ? error.reason : 'Remove Liquidity'}
                </ButtonError>
              </RowBetween>
            )}
          </div>
        </DarkGreyCard>
      </AutoColumn>
    </PageWrapper>
  )
}
