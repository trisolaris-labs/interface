import React, { useContext, useMemo, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { RowBetween } from '../../components/Row'

import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/stableswap-add-liquidity/actions'
import {
  useDerivedStableSwapAddLiquidityInfo,
  useStableSwapAddLiquidityActionHandlers,
  useStableSwapAddLiquidityCallback,
  useStableSwapAddLiquidityState
} from '../../state/stableswap-add-liquidity/hooks'

import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
// import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
// import { PoolPriceBar } from './PoolPriceBar'
import { ChainId } from '@trisolaris/sdk'
import { useTranslation } from 'react-i18next'
// import PriceAndPoolShare from './PriceAndPoolShare'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { divideCurrencyAmountByNumber } from '../../utils'

type Props = {
  stableSwapPoolName: StableSwapPoolName
}

export default function StableSwapPoolAddLiquidityImpl({ stableSwapPoolName }: Props) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2
  } = useStableSwapAddLiquidityState()
  const { currencies, currencyBalances, parsedAmounts, error, hasThirdCurrency } = useDerivedStableSwapAddLiquidityInfo(
    stableSwapPoolName
  )
  const { address } = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]

  const { onField0Input, onField1Input, onField2Input } = useStableSwapAddLiquidityActionHandlers()

  const isValid = !error

  // @TODO Add Loading Animation/behavior
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const { callback: addLiquidityCallback } = useStableSwapAddLiquidityCallback(stableSwapPoolName)

  // @TODO Update this to support generic `Field` values
  // get the max amounts user can add
  const { getMaxAmounts } = useCurrencyInputPanel()
  const { maxAmounts, atMaxAmounts, atHalfAmounts } = getMaxAmounts({ currencyBalances, parsedAmounts })

  // check whether the user has approved the router on the tokens
  const [approval0, approve0Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_0], address)
  const [approval1, approve1Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_1], address)
  const [approval2, approve2Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_2], address)

  //   useStableSwapLP

  async function onAdd() {
    if (!chainId || !library || !account) {
      return
    }

    // Is this needed for ETH pools?
    const value = null

    setAttemptingTxn(true)
    addLiquidityCallback()
      .then((response: any) => {
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

  const approvalsRow = useMemo(() => {
    const currencyApprovalsData = [
      {
        approval: approval0,
        symbol: currencies[Field.CURRENCY_0]?.symbol,
        onClick: approve0Callback
      },
      {
        approval: approval1,
        symbol: currencies[Field.CURRENCY_1]?.symbol,
        onClick: approve1Callback
      }
    ]

    if (hasThirdCurrency) {
      currencyApprovalsData.push({
        approval: approval2,
        symbol: currencies[Field.CURRENCY_2]?.symbol,
        onClick: approve2Callback
      })
    }

    const hasUnapprovedTokens = currencyApprovalsData.some(({ approval }) =>
      [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approval)
    )

    if (!hasUnapprovedTokens || !isValid) {
      return null
    }

    const width = `${Math.floor(100 / currencyApprovalsData.length) - 2}%`

    return (
      <RowBetween>
        {currencyApprovalsData.map(({ approval, symbol, onClick }, i) => {
          return (
            <ButtonPrimary
              key={symbol ?? i}
              onClick={onClick}
              disabled={[ApprovalState.PENDING, ApprovalState.APPROVED].includes(approval)}
              width={width}
            >
              {approval === ApprovalState.PENDING ? <Dots>Approving {symbol}</Dots> : null}
              {approval === ApprovalState.APPROVED ? <span>Approved {symbol}</span> : null}
              {approval === ApprovalState.NOT_APPROVED
                ? t('addLiquidity.approve') + currencies[Field.CURRENCY_0]?.symbol
                : null}
            </ButtonPrimary>
          )
        })}
      </RowBetween>
    )
  }, [
    approval0,
    approval1,
    approval2,
    approve0Callback,
    approve1Callback,
    approve2Callback,
    currencies,
    hasThirdCurrency,
    isValid,
    t
  ])

  return (
    <>
      <AppBody>
        <Wrapper>
          <AutoColumn gap="20px">
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
              id="add-liquidity-input-token0"
              showCommonBases
            />
            <ColumnCenter>
              <Plus size="16" color={theme.text2} />
            </ColumnCenter>
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
              id="add-liquidity-input-token1"
              showCommonBases
            />
            {hasThirdCurrency ? (
              <>
                <ColumnCenter>
                  <Plus size="16" color={theme.text2} />
                </ColumnCenter>
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
              </>
            ) : null}
            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>{t('addLiquidity.connectWallet')}</ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                {approvalsRow ?? (
                  <ButtonError
                    onClick={() => {
                      //   expertMode ? onAdd() : setShowConfirm(true)
                      onAdd()
                    }}
                    disabled={!isValid}
                    error={!isValid}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {error ?? t('addLiquidity.supply')}
                    </Text>
                  </ButtonError>
                )}
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
