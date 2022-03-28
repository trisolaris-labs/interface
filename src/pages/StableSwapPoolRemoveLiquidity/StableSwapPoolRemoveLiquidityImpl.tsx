import { ChainId, JSBI } from '@trisolaris/sdk'
import React, { useEffect, useRef, useState, useContext } from 'react'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import { ButtonLight, ButtonConfirmed, ButtonError } from '../../components/Button'
import CaptionWithIcon from '../../components/CaptionWithIcon'
import { DarkGreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { PageWrapper } from '../../components/Page'
import { RowBetween } from '../../components/Row'
import { BIG_INT_ZERO } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import useStableSwapEstimateRemoveLiquidity from '../../hooks/useStableSwapEstimateRemoveLiquidity'
import useStableSwapRemoveLiquidity from '../../hooks/useStableSwapRemoveLiquidity'
import { useWalletModalToggle } from '../../state/application/hooks'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
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
import { Plus } from 'lucide-react'
import { ThemeContext } from 'styled-components'
import { useUserSlippageTolerance } from '../../state/user/hooks'

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
  const pool = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const currency = unwrappedToken(pool.lpToken)

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

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, pool.address)
  const handleRemoveLiquidity = useStableSwapRemoveLiquidity({
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

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm

  function modalHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        {estimatedAmounts.map((currencyAmount, index, arr) => {
          const { currency } = currencyAmount
          const numTokens = arr.length
          return currencyAmount.greaterThan(BIG_INT_ZERO) ? (
            <>
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
              {index + 1 < numTokens && (
                <RowFixed>
                  <Plus size="16" color={theme.text2} />
                </RowFixed>
              )}
            </>
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

  return (
    <PageWrapper gap="lg" justify="center">
      <TransactionConfirmationModal
        isOpen={showConfirm}
        onDismiss={
          // handleDismissConfirmation
          () => null
        }
        attemptingTxn={attemptingTxn}
        hash={''}
        content={() => (
          <ConfirmationModalContent
            title={t('removeLiquidity.youWillReceive')}
            // onDismiss={handleDismissConfirmation}
            onDismiss={() => setShowConfirm(false)}
            topContent={modalHeader}
            bottomContent={modalHeader}
          />
        )}
        pendingText={
          'asd'
          // pendingText
        }
      />
      <AutoColumn style={{ width: '100%' }}>
        <DarkGreyCard>
          <AutoColumn gap="20px">
            <RowBetween>
              <AutoColumn justify="start">
                <TYPE.mediumHeader>Remove Liquidity from {poolData.name}</TYPE.mediumHeader>
                <CaptionWithIcon>Stable pools on Trisolaris support uneven withdrawals</CaptionWithIcon>
              </AutoColumn>
              <AutoColumn gap="20px">
                <StableSwapRemoveLiquidityTokenSelector
                  stableSwapPoolName={stableSwapPoolName}
                  tokenIndex={withdrawTokenIndex}
                  onSelectTokenIndex={setWithdrawTokenIndex}
                />
              </AutoColumn>
            </RowBetween>
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
                  error={error != null}
                  disabled={
                    approvalState !== ApprovalState.APPROVED ||
                    parsedAmount == null ||
                    JSBI.equal(parsedAmount.raw, BIG_INT_ZERO)
                  }
                  // onClick={handleRemoveLiquidity}
                  onClick={() => {
                    setShowConfirm(true)
                  }}
                >
                  {error != null ? error.reason : 'Remove Liquidity'}
                </ButtonError>
              </RowBetween>
            )}
          </div>
        </DarkGreyCard>
      </AutoColumn>
    </PageWrapper>
  )
}
