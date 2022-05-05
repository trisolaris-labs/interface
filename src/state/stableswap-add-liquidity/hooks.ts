import { Currency, CurrencyAmount, JSBI, TokenAmount, Percent } from '@trisolaris/sdk'
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
import useStablePoolsData from '../../hooks/useStablePoolsData'

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
  hasFifthCurrency: boolean
  totalLPTokenSuppply: TokenAmount | undefined
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    [Field.CURRENCY_0]: typedValue0,
    [Field.CURRENCY_1]: typedValue1,
    [Field.CURRENCY_2]: typedValue2,
    [Field.CURRENCY_3]: typedValue3,
    [Field.CURRENCY_4]: typedValue4
  } = useStableSwapAddLiquidityState()

  const { lpToken, poolTokens } = STABLESWAP_POOLS[stableSwapPoolName]
  const [currency0, currency1, currency2, currency3, currency4] = poolTokens.map(token => unwrappedToken(token))
  const hasThirdCurrency = currency2 != null
  const hasFourthCurrency = hasThirdCurrency && currency3 != null
  const hasFifthCurrency = hasFourthCurrency && currency4 != null

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_0]: currency0 ?? undefined,
      [Field.CURRENCY_1]: currency1 ?? undefined,
      [Field.CURRENCY_2]: currency2 ?? undefined,
      [Field.CURRENCY_3]: currency3 ?? undefined,
      [Field.CURRENCY_4]: currency4 ?? undefined
    }),
    [currency0, currency1, currency2, currency3, currency4]
  )

  const totalLPTokenSuppply = useTotalSupply(lpToken)

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_0],
    currencies[Field.CURRENCY_1],
    currencies[Field.CURRENCY_2],
    currencies[Field.CURRENCY_3],
    currencies[Field.CURRENCY_4]
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_0]: balances[0],
    [Field.CURRENCY_1]: balances[1],
    [Field.CURRENCY_2]: balances[2],
    [Field.CURRENCY_3]: balances[3],
    [Field.CURRENCY_4]: balances[4]
  }

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = {
    [Field.CURRENCY_0]: tryParseAmount(typedValue0, currencies[Field.CURRENCY_0]),
    [Field.CURRENCY_1]: tryParseAmount(typedValue1, currencies[Field.CURRENCY_1]),
    [Field.CURRENCY_2]: tryParseAmount(typedValue2, currencies[Field.CURRENCY_2]),
    [Field.CURRENCY_3]: tryParseAmount(typedValue3, currencies[Field.CURRENCY_3]),
    [Field.CURRENCY_4]: tryParseAmount(typedValue4, currencies[Field.CURRENCY_4])
  }

  let error: string | undefined
  if (!account) {
    error = t('mintHooks.connectWallet')
  }

  if (
    !parsedAmounts[Field.CURRENCY_0] &&
    !parsedAmounts[Field.CURRENCY_1] &&
    (hasThirdCurrency ? !parsedAmounts[Field.CURRENCY_2] : false) &&
    (hasFourthCurrency ? !parsedAmounts[Field.CURRENCY_3] : false) &&
    (hasFifthCurrency ? !parsedAmounts[Field.CURRENCY_4] : false)
  ) {
    error = error ?? t('mintHooks.enterAmount')
  }

  const {
    [Field.CURRENCY_0]: currency0Amount,
    [Field.CURRENCY_1]: currency1Amount,
    [Field.CURRENCY_2]: currency2Amount,
    [Field.CURRENCY_3]: currency3Amount,
    [Field.CURRENCY_4]: currency4Amount
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

  if (hasFifthCurrency && currency4Amount && currencyBalances?.[Field.CURRENCY_4]?.lessThan(currency4Amount)) {
    error = t('mintHooks.insufficient') + currencies[Field.CURRENCY_4]?.symbol + t('mintHooks.balance')
  }

  return {
    currencies,
    currencyBalances,
    parsedAmounts,
    error,
    hasThirdCurrency,
    hasFourthCurrency,
    hasFifthCurrency,
    totalLPTokenSuppply
  }
}

export function useStableSwapAddLiquidityActionHandlers(): {
  onField0Input: (typedValue: string) => void
  onField1Input: (typedValue: string) => void
  onField2Input: (typedValue: string) => void
  onField3Input: (typedValue: string) => void
  onField4Input: (typedValue: string) => void
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
  const onField4Input = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_4, typedValue }))
    },
    [dispatch]
  )

  return {
    onField0Input,
    onField1Input,
    onField2Input,
    onField4Input,
    onField3Input
  }
}

export function useStableSwapAddLiquidityCallback(
  stableSwapPoolName: StableSwapPoolName
): {
  callback: () => Promise<string>
  txHash: string
  setTxHash: React.Dispatch<React.SetStateAction<string>>
  getAddLiquidityPriceImpact: () => Promise<Percent | null>
} {
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
    hasFifthCurrency,
    totalLPTokenSuppply
  } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)
  const [{ virtualPrice }] = useStablePoolsData(stableSwapPoolName)

  const [txHash, setTxHash] = useState('')
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()

  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const getFormattedCurrencies = useCallback(() => {
    const currencyAmounts = [parsedAmounts[Field.CURRENCY_0], parsedAmounts[Field.CURRENCY_1]]
    if (hasThirdCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_2])
    }

    if (hasFourthCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_3])
    }

    if (hasFifthCurrency) {
      currencyAmounts.push(parsedAmounts[Field.CURRENCY_4])
    }

    const formattedCurrencyAmounts = currencyAmounts.map(item => item?.raw?.toString() ?? '0')

    return formattedCurrencyAmounts
  }, [hasFifthCurrency, hasFourthCurrency, hasThirdCurrency, parsedAmounts])

  // sum all normalized inputted currencies
  // divide by (virtual price * min amount of LP tokens received)
  // If this percent is too high, show a warning
  async function getAddLiquidityPriceImpact(): Promise<Percent | null> {
    if (virtualPrice == null) {
      return null
    }

    const groupedCurrencies = [
      {
        currency: currencies.CURRENCY_0,
        amount: parsedAmounts[Field.CURRENCY_0]
      },
      {
        currency: currencies.CURRENCY_1,
        amount: parsedAmounts[Field.CURRENCY_1]
      }
    ]

    if (groupedCurrencies[0].currency == null || groupedCurrencies[1].currency == null) {
      return null
    }

    if (hasThirdCurrency) {
      groupedCurrencies.push({
        currency: currencies.CURRENCY_2,
        amount: parsedAmounts[Field.CURRENCY_2]
      })
    }

    if (hasFourthCurrency) {
      groupedCurrencies.push({
        currency: currencies.CURRENCY_3,
        amount: parsedAmounts[Field.CURRENCY_3]
      })
    }

    if (hasFifthCurrency) {
      groupedCurrencies.push({
        currency: currencies.CURRENCY_4,
        amount: parsedAmounts[Field.CURRENCY_4]
      })
    }

    const minDecimals = groupedCurrencies.reduce(
      (acc, { currency }) => Math.min(currency?.decimals ?? Infinity, acc),
      groupedCurrencies[0].currency.decimals
    )

    const normalizedCurrencyInputs = groupedCurrencies.map(({ currency, amount }, i) => {
      if (currency == null || amount == null) {
        return null
      }

      const decimalDifference = JSBI.BigInt(currency.decimals - minDecimals)
      const normalizedCurrencyInput = JSBI.divide(amount.raw, JSBI.exponentiate(JSBI.BigInt(10), decimalDifference))

      return normalizedCurrencyInput
    })

    const normalizedInputtedCurrencySum: JSBI = normalizedCurrencyInputs.reduce(
      (acc: JSBI, item) => JSBI.add(acc, item ?? BIG_INT_ZERO),
      BIG_INT_ZERO
    )

    const minToMint = await getMinToMint()

    if (minToMint == null) {
      return null
    }

    const expectedLPAmountInUSD = JSBI.divide(
      JSBI.multiply(virtualPrice.raw, minToMint),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))
    )

    // normalize virtual price to minDecimals
    if (minDecimals > 18) {
      // @TODO Gracefully handle this case
      throw new Error('minDecimals is too high')
    }

    const STABLE_POOL_CONTRACT_DECIMALS = 18

    const decimalDifference = JSBI.BigInt(STABLE_POOL_CONTRACT_DECIMALS - minDecimals)
    const normalizedExpectedLPAmountInUSD = JSBI.divide(
      expectedLPAmountInUSD,
      JSBI.exponentiate(JSBI.BigInt(10), decimalDifference)
    )

    if (JSBI.greaterThan(normalizedExpectedLPAmountInUSD, normalizedInputtedCurrencySum)) {
      return null
    }

    console.log('normalizedInputtedCurrencySum: ', normalizedInputtedCurrencySum.toString())
    console.log('normalizedExpectedLPAmountInUSD: ', normalizedExpectedLPAmountInUSD.toString())

    // const delta = JSBI.divide(normalizedInputtedCurrencySum, normalizedExpectedLPAmountInUSD)
    let delta = JSBI.subtract(normalizedExpectedLPAmountInUSD, normalizedInputtedCurrencySum)
    delta = JSBI.lessThan(delta, JSBI.BigInt(0)) ? JSBI.multiply(delta, JSBI.BigInt(-1)) : delta
    console.log('delta: ', delta.toString())

    const allowedSlippageJSBI = JSBI.divide(
      JSBI.multiply(normalizedInputtedCurrencySum, JSBI.BigInt(allowedSlippage)),
      JSBI.BigInt(10000)
    )
    console.log('allowedSlippageJSBI: ', allowedSlippageJSBI.toString())
    const hasHighSlippage = JSBI.greaterThan(delta, allowedSlippageJSBI)
    console.log('hasHighSlippage: ', hasHighSlippage.toString())

    if (!hasHighSlippage) {
      console.log('its fine')
      return null
    }

    // TODO: Needs verifying
    const result = new Percent(
      delta,
      allowedSlippageJSBI
      // JSBI.BigInt(100)
    )

    console.log('result: ', result.toFixed(4))

    return result
  }

  const getMinToMint = useCallback(async () => {
    const isFirstTransaction = JSBI.equal(totalLPTokenSuppply?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)
    if (isFirstTransaction) {
      return BIG_INT_ZERO
    }

    const formattedCurrencyAmounts = getFormattedCurrencies()

    const minToMint = await stableSwapContract?.calculateTokenAmount(
      formattedCurrencyAmounts,
      true // deposit boolean
    )

    const minToMintLessSlippage = computeSlippageAdjustedMinAmount(JSBI.BigInt(minToMint), allowedSlippage)

    return minToMintLessSlippage
  }, [allowedSlippage, getFormattedCurrencies, stableSwapContract, totalLPTokenSuppply?.raw])

  const callback = useCallback(async () => {
    const minToMint = await getMinToMint()
    const formattedCurrencyAmounts = getFormattedCurrencies()
    const transactionArguments = [formattedCurrencyAmounts, minToMint.toString(), deadline?.toNumber()]
    const transaction = await stableSwapContract?.addLiquidity(...transactionArguments, {
      from: account
    })

    await transaction?.wait()

    const summary = ([
      Field.CURRENCY_0,
      Field.CURRENCY_1,
      Field.CURRENCY_2,
      Field.CURRENCY_3,
      Field.CURRENCY_4
    ] as Field[]).reduce((acc, key: Field) => {
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
    getFormattedCurrencies,
    getMinToMint,
    parsedAmounts,
    stableSwapContract
  ])

  return { callback, txHash, setTxHash, getAddLiquidityPriceImpact }
}
