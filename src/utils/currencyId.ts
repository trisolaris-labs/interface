import { Currency, CETH, Token } from '@trisolaris/sdk'
import { AVAILABLE_CHAINS_DATA } from '../constants/availableChainsData'
import { useActiveWeb3React } from '../hooks'

export function currencyId(currency: Currency, chainId:number): string {
  const nativeCurrency = AVAILABLE_CHAINS_DATA[chainId]?.networkParams?.nativeCurrency
  if (currency.symbol === nativeCurrency.symbol) return nativeCurrency.symbol
  if (currency === CETH) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
