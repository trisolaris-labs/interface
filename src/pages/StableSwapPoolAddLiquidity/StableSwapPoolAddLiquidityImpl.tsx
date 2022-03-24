import React, { useContext, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight } from '../../components/Button'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'

import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/stableswap-add-liquidity/actions'
import {
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
import { divideCurrencyAmountByNumber } from '../../utils'
import StableSwapPoolAddLiquidityApprovalsRow from './StableSwapPoolAddLiquidityApprovalsRow'
import { TYPE } from '../../theme'
import Settings from '../../components/Settings'
import { HeadingContainer } from '../Swap/Swap.styles'

type Props = {
  stableSwapPoolName: StableSwapPoolName
}

export default function StableSwapPoolAddLiquidityImpl({ stableSwapPoolName }: Props) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // const expertMode = useIsExpertMode()

  // mint state
  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2
  } = useStableSwapAddLiquidityState()
  const { currencies, currencyBalances, parsedAmounts, error, hasThirdCurrency } = useDerivedStableSwapAddLiquidityInfo(
    stableSwapPoolName
  )

  const { onField0Input, onField1Input, onField2Input } = useStableSwapAddLiquidityActionHandlers()

  const isValid = !error

  // @TODO Add Loading Animation/behavior
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const { callback: addLiquidityCallback } = useStableSwapAddLiquidityCallback(stableSwapPoolName)

  // get the max amounts user can add
  const { getMaxAmounts } = useCurrencyInputPanel()
  const { maxAmounts, atMaxAmounts, atHalfAmounts } = getMaxAmounts({ currencyBalances, parsedAmounts })

  async function onAdd() {
    if (!chainId || !library || !account) {
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

  return (
    <>
      <AppBody>
        <Wrapper>
          <AutoColumn gap="20px">
            <HeadingContainer>
              <TYPE.mediumHeader>Add Liquidity to {stableSwapPoolName}</TYPE.mediumHeader>
              <Settings />
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
                <StableSwapPoolAddLiquidityApprovalsRow stableSwapPoolName={stableSwapPoolName}>
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
                </StableSwapPoolAddLiquidityApprovalsRow>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
