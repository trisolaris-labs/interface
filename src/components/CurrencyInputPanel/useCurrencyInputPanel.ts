import { CurrencyAmount, TokenAmount } from '@trisolaris/sdk'
import { Field } from '../../state/mint/actions'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { divideCurrencyAmountByNumber } from '../../utils'
import BalanceButtonValueEnum from '../BalanceButton/BalanceButtonValueEnum'

type Props = {
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
}

export default function useCurrencyInputPanel() {
  const getMaxAmounts = function getMaxAmounts({ currencyBalances, parsedAmounts }: Props) {
    const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
      (accumulator, field) => {
        return {
          ...accumulator,
          [field]: maxAmountSpend(currencyBalances[field])
        }
      },
      {}
    )

    const atMaxAmounts: { [field in Field]?: boolean } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
      (accumulator, field) => {
        return {
          ...accumulator,
          [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
        }
      },
      {}
    )

    const atHalfAmounts: { [field in Field]?: boolean } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
      (accumulator, field) => {
        return {
          ...accumulator,
          [field]: divideCurrencyAmountByNumber(maxAmounts[field], 2)?.equalTo(parsedAmounts[field] ?? '0')
        }
      },
      {}
    )

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
    const atHalfAmount =
      maxAmountInput != null && halfMaxAmountInput != null ? parsedAmount?.equalTo(halfMaxAmountInput) : false

    const getClickedAmount = (value: BalanceButtonValueEnum) => {
      let amount
      if (maxAmountInput != null) {
        amount =
          value === BalanceButtonValueEnum.HALF ? divideCurrencyAmountByNumber(maxAmountInput, 2) : maxAmountInput
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
