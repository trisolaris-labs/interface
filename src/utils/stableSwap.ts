import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount } from '@trisolaris/sdk'
import { USDC_E } from '../constants/tokens'

export function getLpTokenUsdEstimate(lpTokenPriceUSDC: TokenAmount, amount: CurrencyAmount) {
  return new TokenAmount(
    USDC_E[ChainId.AURORA],
    JSBI.divide(JSBI.multiply(lpTokenPriceUSDC.raw, amount.raw), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
  )
}
