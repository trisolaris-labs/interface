import { Token, TokenAmount, CETH } from '@trisolaris/sdk'
import { TRI } from '../constants/tokens'
import { unwrappedToken } from './wrappedCurrency'

export const getPairRenderOrder = (tokens: Token[]) => {
  const currencyMap = tokens.map(token => unwrappedToken(token))
  if (tokens.length > 2) {
    return {
      currencies: currencyMap,
      tokens
    }
  }

  const currency0 = currencyMap[0]
  const currency1 = currencyMap[1]
  const token0 = tokens[0]
  const token1 = tokens[1]

  const token0IsFirst = {
    currencies: [currency0, currency1],
    tokens: [token0, token1]
  }
  const token1IsFirst = {
    currencies: [currency1, currency0],
    tokens: [token1, token0]
  }

  // If pair has CETH, put CETH second
  //      If TRI is the other token, it'll be first
  if (currency0 === CETH || currency1 === CETH) {
    return currency0 === CETH ? token1IsFirst : token0IsFirst
  }

  // If pair has TRI, put TRI first
  return token0.equals(TRI[token0.chainId]) ? token0IsFirst : token1IsFirst
}

export const isTokenAmountPositive = (stakedAmount: TokenAmount | null | undefined) => {
  return Boolean(stakedAmount?.greaterThan('0') ?? false)
}