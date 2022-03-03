import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('stableswap/selectCurrency')
export const switchCurrencies = createAction<void>('stableswap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('stableswap/typeInput')
export const replaceStableSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('stableswap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('stableswap/setRecipient')
