import { createReducer } from '@reduxjs/toolkit'
import { Field, resetAddLiquidityState, typeInput } from './actions'

export interface StableSwapAddLiquidityState {
  readonly [Field.CURRENCY_0]: string
  readonly [Field.CURRENCY_1]: string
  readonly [Field.CURRENCY_2]: string
  readonly [Field.CURRENCY_3]: string
  readonly [Field.CURRENCY_4]: string
}

const initialState: StableSwapAddLiquidityState = {
  [Field.CURRENCY_0]: '',
  [Field.CURRENCY_1]: '',
  [Field.CURRENCY_2]: '',
  [Field.CURRENCY_3]: '',
  [Field.CURRENCY_4]: ''
}

export default createReducer<StableSwapAddLiquidityState>(initialState, builder =>
  builder
    .addCase(resetAddLiquidityState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        [field]: typedValue
      }
    })
)
