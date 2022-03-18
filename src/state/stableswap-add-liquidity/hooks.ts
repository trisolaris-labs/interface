import { Currency, CurrencyAmount, JSBI, TokenAmount } from '@trisolaris/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'
import { useTranslation } from 'react-i18next'

import { StableSwapPoolName } from '../stableswap/constants'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import { useStableSwapContract } from '../../hooks/useContract'
import { BIG_INT_ZERO } from '../../constants'
import { useUserSlippageTolerance } from '../user/hooks'
import { basisPointsToPercent } from '../../utils'
import { BigNumber } from 'ethers'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../transactions/hooks'

export function useStableSwapAddLiquidityState(): AppState['stableswapAddLiquidity'] {
  return useSelector<AppState, AppState['stableswapAddLiquidity']>(state => state.stableswapAddLiquidity)
}

export function useDerivedStableSwapAddLiquidityInfo(
  stableSwapPoolName: StableSwapPoolName
): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  error?: string
  hasThirdCurrency: boolean
  totalLPTokenSuppply: TokenAmount | undefined
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2
  } = useStableSwapAddLiquidityState()

  const [poolData] = useStablePoolsData(stableSwapPoolName)
  const [currency0, currency1, currency2] = poolData.tokens.map(({ token }) => unwrappedToken(token))
  const hasThirdCurrency = currency2 != null

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
  const totalLPTokenSuppply = useTotalSupply(pair?.liquidityToken)

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_0],
    currencies[Field.CURRENCY_1],
    currencies[Field.CURRENCY_2]
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_0]: balances[0],
    [Field.CURRENCY_1]: balances[1],
    [Field.CURRENCY_2]: balances[2]
  }

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = {
    [Field.CURRENCY_0]: tryParseAmount(typedValue0, currencies[Field.CURRENCY_0]),
    [Field.CURRENCY_1]: tryParseAmount(typedValue1, currencies[Field.CURRENCY_1]),
    [Field.CURRENCY_2]: tryParseAmount(typedValue2, currencies[Field.CURRENCY_2])
  }

  let error: string | undefined
  if (!account) {
    error = t('mintHooks.connectWallet')
  }

  if (pairState === PairState.INVALID) {
    error = error ?? t('mintHooks.invalidPair')
  }

  if (
    !parsedAmounts[Field.CURRENCY_0] &&
    !parsedAmounts[Field.CURRENCY_1] &&
    (hasThirdCurrency ? !parsedAmounts[Field.CURRENCY_2] : false)
  ) {
    error = error ?? t('mintHooks.enterAmount')
  }

  const {
    [Field.CURRENCY_0]: currency0Amount,
    [Field.CURRENCY_1]: currency1Amount,
    [Field.CURRENCY_2]: currency2Amount
  } = parsedAmounts

  if (currency0Amount && currencyBalances?.[Field.CURRENCY_0]?.lessThan(currency0Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_0]?.symbol + t('mintHooks.balance')
  }

  if (currency1Amount && currencyBalances?.[Field.CURRENCY_1]?.lessThan(currency1Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_1]?.symbol + t('mintHooks.balance')
  }

  if (hasThirdCurrency && currency2Amount && currencyBalances?.[Field.CURRENCY_2]?.lessThan(currency2Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_2]?.symbol + t('mintHooks.balance')
  }

  return {
    currencies,
    currencyBalances,
    parsedAmounts,
    error,
    hasThirdCurrency,
    totalLPTokenSuppply
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

export function useStableSwapAddLiquidityCallback(
  stableSwapPoolName: StableSwapPoolName
): { callback: () => Promise<string> } {
  const { account } = useActiveWeb3React()
  const stableSwapContract = useStableSwapContract(stableSwapPoolName)
  const { currencies, parsedAmounts, hasThirdCurrency, totalLPTokenSuppply } = useDerivedStableSwapAddLiquidityInfo(
    stableSwapPoolName
  )
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const slippageAsPercent = basisPointsToPercent(allowedSlippage)
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()

  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const callback = useCallback(async () => {
    const currencyAmounts = [parsedAmounts[Field.CURRENCY_0], parsedAmounts[Field.CURRENCY_1]]
    if (hasThirdCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_2])
    }

    const formattedCurrencyAmounts = currencyAmounts.map(item => item?.raw?.toString() ?? '0')
    const isFirstTransaction = JSBI.equal(totalLPTokenSuppply?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

    // @TODO Fix this calculation
    // const minToMint = isFirstTransaction
    //   ? BIG_INT_ZERO.toString()
    //   : await stableSwapContract?.calculateTokenAmount(
    //       formattedCurrencyAmounts,
    //       true // deposit boolean
    //     )
    const minToMint = '0'
    const transactionArguments = [formattedCurrencyAmounts, minToMint, deadline?.toNumber()]

    // @TODO Subtract slippage from `minToMint`
    const transaction = await stableSwapContract?.addLiquidity(...transactionArguments, {
      from: account
    })

    await transaction?.wait()

    const summary = ([Field.CURRENCY_0, Field.CURRENCY_1, Field.CURRENCY_2] as Field[]).reduce((acc, key: Field) => {
      if (parsedAmounts[key] != null && currencies[key] != null) {
        acc.push(`${parsedAmounts[key]?.toSignificant(3)} ${currencies[key]?.symbol}`)
      }

      return acc
    }, [] as string[])

    addTransaction(transaction, {
      summary: `Add ${summary.join(', ')}`
    })

    return transaction
  }, [
    account,
    addTransaction,
    currencies,
    deadline,
    hasThirdCurrency,
    parsedAmounts,
    stableSwapContract,
    totalLPTokenSuppply?.raw
  ])

  return { callback }
}
