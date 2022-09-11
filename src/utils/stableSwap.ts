import { CurrencyAmount, JSBI, Token, TokenAmount } from '@trisolaris/sdk'

export function getLpTokenUsdEstimate(
  virtualPrice: TokenAmount,
  amount: CurrencyAmount,
  lpToken: Token,
  auUSDCExchangeRate?: JSBI | null
) {
  return auUSDCExchangeRate
    ? new TokenAmount(
        lpToken,
        JSBI.divide(JSBI.multiply(auUSDCExchangeRate, amount.raw), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)))
      )
    : new TokenAmount(
        lpToken,
        JSBI.divide(JSBI.multiply(virtualPrice.raw, amount.raw), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      )
}
