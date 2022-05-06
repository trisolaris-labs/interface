import { Percent } from '@trisolaris/sdk'
import { PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from '../../constants'
import i18next from '../../i18n'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmAddLiquiditySlippage(priceImpactWithoutFee: Percent): boolean {
  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(
        'Warning: There is a high Price Impact on this transaction due either to the ' +
          "transaction's size or insufficient liquidity, which will result in a loss of funds. " +
          'Please confirm that you understand before submitting your transaction.'
      ) === i18next.t('swap.confirm')
    )
  }

  return true
}
