import { AnyAction, combineReducers, EmptyObject, Store } from '@reduxjs/toolkit'

import application, { ApplicationState } from './application/reducer'
import user, { UserState } from './user/reducer'
import transactions, { TransactionState } from './transactions/reducer'
import swap, { SwapState } from './swap/reducer'
import mint, { MintState } from './mint/reducer'
import lists, { ListsState } from './lists/reducer'
import burn, { BurnState } from './burn/reducer'
import multicall, { MulticallState } from './multicall/reducer'
import wyre, { WyreState } from './wyre/reducer'

import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'

import storage from 'redux-persist/lib/storage'
import { PersistPartial } from 'redux-persist/lib/persistReducer'

const reducer = combineReducers({
  application,
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
  wyre
})

type State = EmptyObject & {
  application: ApplicationState
  user: UserState
  transactions: TransactionState
  swap: SwapState
  mint: MintState
  burn: BurnState
  multicall: MulticallState
  lists: ListsState
  wyre: WyreState
} & PersistPartial

type StoreType = Store<State, AnyAction>

let store: StoreType | undefined

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const persistConfig: any = {
  key: 'root',
  whitelist: PERSISTED_KEYS,
  storage
}

const persistedReducer = persistReducer(persistConfig, reducer)

function makeStore(preloadedState: State | undefined = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        thunk: true,
        immutableCheck: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState
  })
}

export const getOrCreateStore = (preloadedState: State | undefined = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) store = _store

  return _store
}

store = getOrCreateStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store!

export const persistor = persistStore(store)
