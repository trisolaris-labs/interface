import { CurrencyAmount, CETH, JSBI } from '@trisolaris/sdk'
import { BIG_INT_ZERO as MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === CETH) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    } else {
      return CurrencyAmount.ether(MIN_ETH)
    }
  }
  return currencyAmount
}
