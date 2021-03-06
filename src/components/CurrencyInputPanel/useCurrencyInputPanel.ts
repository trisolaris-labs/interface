import { CurrencyAmount, TokenAmount } from '@trisolaris/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { divideCurrencyAmountByNumber } from '../../utils'
import BalanceButtonValueEnum from '../BalanceButton/BalanceButtonValueEnum'
import _ from 'lodash'

type TAmounts<Type> = { [x: string]: Type }

export default function useCurrencyInputPanel() {
  const getMaxAmounts = function getMaxAmounts({
    currencyBalances,
    parsedAmounts
  }: {
    currencyBalances: TAmounts<CurrencyAmount | undefined>
    parsedAmounts: TAmounts<CurrencyAmount | undefined>
  }) {
    const maxAmounts: TAmounts<TokenAmount> = _.keys(currencyBalances).reduce((accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    }, {})

    const atMaxAmounts: TAmounts<boolean> = _.keys(currencyBalances).reduce((accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    }, {})

    const atHalfAmounts: TAmounts<boolean> = _.keys(currencyBalances).reduce((accumulator, field) => {
      return {
        ...accumulator,
        [field]: divideCurrencyAmountByNumber(maxAmounts[field], 2)?.equalTo(parsedAmounts[field] ?? '0')
      }
    }, {})

    return { maxAmounts, atMaxAmounts, atHalfAmounts }
  }

  const getMaxInputAmount = function({
    amount,
    parsedAmount
  }: {
    amount: CurrencyAmount | undefined
    parsedAmount: CurrencyAmount | undefined
  }) {
    const maxAmountInput = maxAmountSpend(amount)
    const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))

    const halfMaxAmountInput = divideCurrencyAmountByNumber(maxAmountInput, 2)
    const atHalfAmount = halfMaxAmountInput != null ? parsedAmount?.equalTo(halfMaxAmountInput) : false

    const getClickedAmount = (value: BalanceButtonValueEnum) => {
      let amount
      if (maxAmountInput != null) {
        amount = value === BalanceButtonValueEnum.HALF ? halfMaxAmountInput : maxAmountInput
      }

      return amount?.toExact() ?? '0'
    }

    return {
      atMaxAmount,
      atHalfAmount,
      getClickedAmount,
      maxAmountInput
    }
  }

  return {
    getMaxAmounts,
    getMaxInputAmount
  }
}
