import { Currency, CurrencyAmount, JSBI, TokenAmount } from '@trisolaris/sdk'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'
import { useTranslation } from 'react-i18next'

import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../stableswap/constants'
import { useStableSwapContract } from '../../hooks/useContract'
import { BIG_INT_ZERO } from '../../constants'
import { useUserSlippageTolerance } from '../user/hooks'
import { BigNumber } from 'ethers'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../transactions/hooks'
import { computeSlippageAdjustedMinAmount } from '../../utils/prices'

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
  hasFourthCurrency: boolean
  totalLPTokenSuppply: TokenAmount | undefined
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2,
    [Field.CURRENCY_3]: typedValue3
  } = useStableSwapAddLiquidityState()

  const { lpToken, poolTokens } = STABLESWAP_POOLS[stableSwapPoolName]
  const [currency0, currency1, currency2, currency3] = poolTokens.map(token => unwrappedToken(token))
  const hasThirdCurrency = currency2 != null
  const hasFourthCurrency = hasThirdCurrency && currency3 != null

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_0]: currency0 ?? undefined,
      [Field.CURRENCY_1]: currency1 ?? undefined,
      [Field.CURRENCY_2]: currency2 ?? undefined,
      [Field.CURRENCY_3]: currency3 ?? undefined
    }),
    [currency0, currency1, currency2, currency3]
  )

  const totalLPTokenSuppply = useTotalSupply(lpToken)

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_0],
    currencies[Field.CURRENCY_1],
    currencies[Field.CURRENCY_2],
    currencies[Field.CURRENCY_3]
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_0]: balances[0],
    [Field.CURRENCY_1]: balances[1],
    [Field.CURRENCY_2]: balances[2],
    [Field.CURRENCY_3]: balances[3]
  }

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = {
    [Field.CURRENCY_0]: tryParseAmount(typedValue0, currencies[Field.CURRENCY_0]),
    [Field.CURRENCY_1]: tryParseAmount(typedValue1, currencies[Field.CURRENCY_1]),
    [Field.CURRENCY_2]: tryParseAmount(typedValue2, currencies[Field.CURRENCY_2]),
    [Field.CURRENCY_3]: tryParseAmount(typedValue3, currencies[Field.CURRENCY_3])
  }

  let error: string | undefined
  if (!account) {
    error = t('mintHooks.connectWallet')
  }

  if (
    !parsedAmounts[Field.CURRENCY_0] &&
    !parsedAmounts[Field.CURRENCY_1] &&
    (hasThirdCurrency ? !parsedAmounts[Field.CURRENCY_2] : false) &&
    (hasFourthCurrency ? !parsedAmounts[Field.CURRENCY_3] : false)
  ) {
    error = error ?? t('mintHooks.enterAmount')
  }

  const {
    [Field.CURRENCY_0]: currency0Amount,
    [Field.CURRENCY_1]: currency1Amount,
    [Field.CURRENCY_2]: currency2Amount,
    [Field.CURRENCY_3]: currency3Amount
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

  if (hasFourthCurrency && currency3Amount && currencyBalances?.[Field.CURRENCY_3]?.lessThan(currency3Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_3]?.symbol + t('mintHooks.balance')
  }

  return {
    currencies,
    currencyBalances,
    parsedAmounts,
    error,
    hasThirdCurrency,
    hasFourthCurrency,
    totalLPTokenSuppply
  }
}

export function useStableSwapAddLiquidityActionHandlers(): {
  onField0Input: (typedValue: string) => void
  onField1Input: (typedValue: string) => void
  onField2Input: (typedValue: string) => void
  onField3Input: (typedValue: string) => void
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
  const onField3Input = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_3, typedValue }))
    },
    [dispatch]
  )

  return {
    onField0Input,
    onField1Input,
    onField2Input,
    onField3Input
  }
}

export function useStableSwapAddLiquidityCallback(
  stableSwapPoolName: StableSwapPoolName
): { callback: () => Promise<string>; txHash: string; setTxHash: React.Dispatch<React.SetStateAction<string>> } {
  const { account } = useActiveWeb3React()
  const stableSwapContract = useStableSwapContract(
    stableSwapPoolName,
    true, // require signer
    isMetaPool(stableSwapPoolName) // if it's a metapool, use unwrapped tokens
  )
  const {
    currencies,
    parsedAmounts,
    hasThirdCurrency,
    hasFourthCurrency,
    totalLPTokenSuppply
  } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)

  const [txHash, setTxHash] = useState('')
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()

  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const getMinToMint = useCallback(
    async (formattedCurrencyAmounts: string[]) => {
      const isFirstTransaction = JSBI.equal(totalLPTokenSuppply?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)
      if (isFirstTransaction) {
        return BIG_INT_ZERO.toString()
      }

      const minToMint = await stableSwapContract?.calculateTokenAmount(
        formattedCurrencyAmounts,
        true // deposit boolean
      )

      const minToMintLessSlippage = computeSlippageAdjustedMinAmount(JSBI.BigInt(minToMint), allowedSlippage)
      return minToMintLessSlippage.toString()
    },
    [allowedSlippage, stableSwapContract, totalLPTokenSuppply?.raw]
  )

  const callback = useCallback(async () => {
    const currencyAmounts = [parsedAmounts[Field.CURRENCY_0], parsedAmounts[Field.CURRENCY_1]]
    if (hasThirdCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_2])
    }

    if (hasFourthCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_3])
    }

    const formattedCurrencyAmounts = currencyAmounts.map(item => item?.raw?.toString() ?? '0')
    const minToMint = await getMinToMint(formattedCurrencyAmounts)

    const transactionArguments = [formattedCurrencyAmounts, minToMint, deadline?.toNumber()]
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
    setTxHash(transaction.hash)
    return transaction
  }, [
    account,
    addTransaction,
    currencies,
    deadline,
    getMinToMint,
    hasFourthCurrency,
    hasThirdCurrency,
    parsedAmounts,
    stableSwapContract
  ])

  return { callback, txHash, setTxHash }
}
