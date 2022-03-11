import { createReducer } from '@reduxjs/toolkit'
import { Field, resetAddLiquidityState, typeInput } from './actions'

export interface StableSwapAddLiquidityState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
}

const initialState: StableSwapAddLiquidityState = {
  independentField: Field.CURRENCY_0,
  typedValue: '',
  otherTypedValue: ''
}

export default createReducer<StableSwapAddLiquidityState>(initialState, builder =>
  builder
    .addCase(resetAddLiquidityState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: ''
      }
    })
)
