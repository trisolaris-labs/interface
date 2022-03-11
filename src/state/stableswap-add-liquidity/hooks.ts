import {
  Currency,
  CurrencyAmount,
  CETH,
  InsufficientInputAmountError,
  JSBI,
  Pair,
  Percent,
  Price,
  TokenAmount
} from '@trisolaris/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'
import { useTranslation } from 'react-i18next'

import { BIG_INT_ZERO } from '../../constants'

export function useStableSwapAddLiquidityState(): AppState['stableswapAddLiquidity'] {
  return useSelector<AppState, AppState['stableswapAddLiquidity']>(state => state.stableswapAddLiquidity)
}

export function useDerivedStableSwapAddLiquidityInfo(
  currency0: Currency | undefined,
  currency1: Currency | undefined,
  currency2: Currency | undefined
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null // @TODO Update this
  pairState: PairState // @TODO Update this
  currency1alances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const { independentField, typedValue, otherTypedValue } = useStableSwapAddLiquidityState()

  // @TODO Do I need this>
  const dependentField = independentField === Field.CURRENCY_0 ? Field.CURRENCY_1 : Field.CURRENCY_0

  // error handling
  let insufficientInput = false

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_0]: currency0 ?? undefined,
      [Field.CURRENCY_1]: currency1 ?? undefined,
      [Field.CURRENCY_2]: currency2 ?? undefined
    }),
    [currency0, currency1, currency2]
  )

  // pair
  const [pairState, pair] = usePair(currencies[Field.CURRENCY_0], currencies[Field.CURRENCY_1])
  const totalSupply = useTotalSupply(pair?.liquidityToken)

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_0],
    currencies[Field.CURRENCY_1]
  ])
  const currency1alances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_0]: balances[0],
    [Field.CURRENCY_1]: balances[1]
  }

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(typedValue, currencies[independentField])
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const [tokenA, tokenB] = [wrappedCurrency(currency0, chainId), wrappedCurrency(currency1, chainId)]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency = dependentField === Field.CURRENCY_1 ? currency1 : currency0
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_1
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency === CETH ? CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount
      }
      return undefined
    } else {
      return undefined
    }
  }, [dependentField, independentAmount, currency0, chainId, currency1, pair])
  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = {
    [Field.CURRENCY_0]: independentField === Field.CURRENCY_0 ? independentAmount : dependentAmount,
    [Field.CURRENCY_1]: independentField === Field.CURRENCY_0 ? dependentAmount : independentAmount,
    [Field.CURRENCY_2]: independentField === Field.CURRENCY_0 ? dependentAmount : independentAmount
  }

  const price = useMemo(() => {
    const wrappedCurrency0 = wrappedCurrency(currency0, chainId)
    return pair && wrappedCurrency0 ? pair.priceOf(wrappedCurrency0) : undefined
  }, [chainId, currency0, pair])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const { [Field.CURRENCY_0]: currency0Amount, [Field.CURRENCY_1]: currency1Amount } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currency0Amount, chainId),
      wrappedCurrencyAmount(currency1Amount, chainId)
    ]
    insufficientInput = false
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } catch (err) {
        if (err instanceof InsufficientInputAmountError) {
          insufficientInput = true
          return undefined
        } else {
          throw err
        }
      }
    } else {
      return undefined
    }
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(liquidityMinted.raw, totalSupply.add(liquidityMinted).raw)
    } else {
      return undefined
    }
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  if (!account) {
    error = t('mintHooks.connectWallet')
  }

  if (insufficientInput) {
    error = t('mintHooks.insufficientInputAmount')
  }

  if (pairState === PairState.INVALID) {
    error = error ?? t('mintHooks.invalidPair')
  }

  if (!parsedAmounts[Field.CURRENCY_0] || !parsedAmounts[Field.CURRENCY_1]) {
    error = error ?? t('mintHooks.enterAmount')
  }

  const { [Field.CURRENCY_0]: currency0Amount, [Field.CURRENCY_1]: currency1Amount } = parsedAmounts

  if (currency0Amount && currency1alances?.[Field.CURRENCY_0]?.lessThan(currency0Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_0]?.symbol + t('mintHooks.balance')
  }

  if (currency1Amount && currency1alances?.[Field.CURRENCY_1]?.lessThan(currency1Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_1]?.symbol + t('mintHooks.balance')
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currency1alances,
    parsedAmounts,
    price,
    liquidityMinted,
    poolTokenPercentage,
    error
  }
}

export function useStableSwapAddLiquidityActionHandlers(): {
  onField0Input: (typedValue: string) => void
  onField1Input: (typedValue: string) => void
  onField2Input: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onField0Input = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_0, typedValue }))
    },
    [dispatch]
  )
  const onField1Input = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_1, typedValue }))
    },
    [dispatch]
  )
  const onField2Input = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_2, typedValue }))
    },
    [dispatch]
  )

  return {
    onField0Input,
    onField1Input,
    onField2Input
  }
}
