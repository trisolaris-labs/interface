import { createAction } from '@reduxjs/toolkit'

export enum Field {
  CURRENCY_0 = 'CURRENCY_0',
  CURRENCY_1 = 'CURRENCY_1',
  CURRENCY_2 = 'CURRENCY_2',
  CURRENCY_3 = 'CURRENCY_3'
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('stableswap-add-liquidity/typeInput')
export const resetAddLiquidityState = createAction<void>('stableswap-add-liquidity/resetAddLiquidityState')
