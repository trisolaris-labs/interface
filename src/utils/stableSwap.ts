import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount } from '@trisolaris/sdk'
import { USDC } from '../constants/tokens'
import { StableSwapPoolName, StableSwapPoolTypes } from '../state/stableswap/constants'

export function getLpTokenUsdEstimate(
  virtualPrice: TokenAmount,
  amount: CurrencyAmount,
  lpToken: Token,
  name: string,
  avgExchangeRate: JSBI
) {
  return name === StableSwapPoolName.AUUSDC_AUUSDT
    ? getAuLpSupplyInUsd(amount, avgExchangeRate)
    : new TokenAmount(
        lpToken,
        JSBI.divide(JSBI.multiply(virtualPrice.raw, amount.raw), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
      )
}

export function getAuLpSupplyInUsd(lpBalance: CurrencyAmount, avgExchangeRate: JSBI) {
  return new TokenAmount(
    USDC[ChainId.AURORA],
    JSBI.divide(
      JSBI.multiply(JSBI.divide(lpBalance.raw, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(10))), avgExchangeRate),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
    )
  )
}

export function getBalanceConversionForStablePoolType(
  poolType: StableSwapPoolTypes,
  balance: JSBI,
  token: Token,
  exchangeRate: JSBI
): TokenAmount {
  if (
    poolType === StableSwapPoolTypes.BTC ||
    poolType === StableSwapPoolTypes.ETH ||
    poolType === StableSwapPoolTypes.USD
  ) {
    return new TokenAmount(token, balance)
  } else if (poolType === StableSwapPoolTypes.AURIGAMI) {
    return new TokenAmount(
      token,
      JSBI.divide(
        JSBI.multiply(JSBI.BigInt(balance), exchangeRate),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
      )
    )
  } else {
    throw new Error('[getTokenForStablePoolType] Error getting tokenAmount conversion')
  }
}
