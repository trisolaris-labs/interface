import { Currency, CETH, Token } from '@trisolaris/sdk'

export function currencyId(currency: Currency): string {
  if(currency.symbol === 'TURBO') return 'TURBO'
  if (currency === CETH) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
