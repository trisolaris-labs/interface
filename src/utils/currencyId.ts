import { Currency, CETH, Token } from '@pangolindex/sdk'

export function currencyId(currency: Currency): string {
  if (currency === CETH) return 'AVAX'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
