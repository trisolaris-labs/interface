import { ChainId, Currency, CurrencyAmount, Token, TokenAmount, configManager} from '@trisolaris/sdk'
import { AVAILABLE_CHAINS_DATA } from '../constants/availableChainsData'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  if (!chainId) return undefined
  const WETH = configManager.getConfig().WETH
  const baseCurrency = AVAILABLE_CHAINS_DATA[chainId]?.networkParams?.nativeCurrency
  const res =
    chainId && currency?.symbol === baseCurrency.symbol ? WETH[chainId] : currency instanceof Token ? currency : undefined
  return res
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token): Currency {
  const WETH = configManager.getConfig().WETH
  const baseCurrency = AVAILABLE_CHAINS_DATA[token.chainId]?.networkParams?.nativeCurrency
  if(!WETH[token.chainId]) return token
  if (token.equals(WETH[token.chainId])) return baseCurrency
  return token
}
