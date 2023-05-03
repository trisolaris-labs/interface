import { ChainId, Currency, CurrencyAmount, JSBI, Percent, Token, TokenAmount } from '@trisolaris/sdk'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { BIG_INT_ZERO, ZERO_ADDRESS } from '../../constants'
import { useUserSlippageTolerance } from '../user/hooks'
import { BigNumber } from 'ethers'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../transactions/hooks'
import { computeSlippageAdjustedMinAmount } from '../../utils/prices'
import { dummyToken } from '../stake/stake-constants'
import { calculatePriceImpact, isStableSwapHighPriceImpact } from '../stableswap/hooks'
import useNormalizeTokensToDecimal from '../../hooks/useNormalizeTokensToDecimal'

const STABLE_POOL_CONTRACT_DECIMALS = 18

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
} {
  const { account } = useActiveWeb3React()
  const stableSwapContract = useStableSwapContract(
    stableSwapPoolName,
    true, // require signer
    isMetaPool(stableSwapPoolName) // if it's a metapool, use unwrapped tokens
  )
  const { currencies, parsedAmounts } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)

  const [txHash, setTxHash] = useState('')
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()

  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const formattedParsedAmounts = useFormattedParsedAmounts(stableSwapPoolName)
  const { getMinToMint } = useGetEstimatedOutput(stableSwapPoolName)

  const callback = useCallback(async () => {
    const minToMint = await getMinToMint()
    const minToMintLessSlippage = computeSlippageAdjustedMinAmount(JSBI.BigInt(minToMint.raw), allowedSlippage)

    const transactionArguments = [formattedParsedAmounts, minToMintLessSlippage.toString(), deadline?.toNumber()]
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
    allowedSlippage,
    currencies,
    deadline,
    formattedParsedAmounts,
    getMinToMint,
    parsedAmounts,
    stableSwapContract
  ])

  return { callback, txHash, setTxHash }
}

export function useGetEstimatedOutput(
  stableSwapPoolName: StableSwapPoolName
): { getMinToMint: () => Promise<CurrencyAmount> } {
  const { totalLPTokenSuppply } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)
  const stableSwapContract = useStableSwapContract(
    stableSwapPoolName,
    true, // require signer
    isMetaPool(stableSwapPoolName) // if it's a metapool, use unwrapped tokens
  )
  const formattedParsedAmounts = useFormattedParsedAmounts(stableSwapPoolName)
  const totalLPTokenSupplyValue = totalLPTokenSuppply?.raw?.toString()

  const getMinToMint = useCallback(async () => {
    const isFirstTransaction = JSBI.equal(JSBI.BigInt(totalLPTokenSupplyValue ?? BIG_INT_ZERO), BIG_INT_ZERO)
    const currency = totalLPTokenSuppply?.currency ?? dummyToken
    if (isFirstTransaction) {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(BIG_INT_ZERO))
    }

    const minToMint = await stableSwapContract?.calculateTokenAmount(
      formattedParsedAmounts,
      true // deposit boolean
    )

    return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(minToMint))
  }, [formattedParsedAmounts, stableSwapContract, totalLPTokenSupplyValue, totalLPTokenSuppply?.currency])

  return { getMinToMint }
}

/**
 * Aggregates all input currencies and normalizes them to a common decimal
 */
export function useNormalizedInputTokenSum(
  stableSwapPoolName: StableSwapPoolName,
  normalizationDecimals: number = STABLE_POOL_CONTRACT_DECIMALS
): TokenAmount {
  const { parsedAmounts } = useDerivedStableSwapAddLiquidityInfo(stableSwapPoolName)
  const token = new Token(ChainId.AURORA, ZERO_ADDRESS, normalizationDecimals, 'ZERO', 'ZERO')

  const currencyAmounts = [
    parsedAmounts[Field.CURRENCY_0],
    parsedAmounts[Field.CURRENCY_1],
    parsedAmounts[Field.CURRENCY_2],
    parsedAmounts[Field.CURRENCY_3],
    parsedAmounts[Field.CURRENCY_4]
  ]

  const normalizedAmounts = useNormalizeTokensToDecimal({ currencyAmounts, normalizationToken: token })
  const normalizedSum = normalizedAmounts.reduce((acc, item) => JSBI.add(acc, item.raw), BIG_INT_ZERO)

  return new TokenAmount(token, normalizedSum)
}

function useFormattedParsedAmounts(stableSwapPoolName: StableSwapPoolName) {
  const { parsedAmounts, hasThirdCurrency, hasFourthCurrency, hasFifthCurrency } = useDerivedStableSwapAddLiquidityInfo(
    stableSwapPoolName
  )

  const [typedValue0, typedValue1, typedValue2, typedValue3, typedValue4] = [
    parsedAmounts[Field.CURRENCY_0],
    parsedAmounts[Field.CURRENCY_1],
    parsedAmounts[Field.CURRENCY_2],
    parsedAmounts[Field.CURRENCY_3],
    parsedAmounts[Field.CURRENCY_4]
  ].map(v => v?.raw?.toString() ?? '0')

  const formattedCurrencyAmounts = useMemo(() => {
    const currencyAmounts = [typedValue0, typedValue1]
    if (hasThirdCurrency) {
      currencyAmounts.push(typedValue2)
    }

    if (hasFourthCurrency) {
      currencyAmounts.push(typedValue3)
    }

    if (hasFifthCurrency) {
      currencyAmounts.push(typedValue4)
    }

    return currencyAmounts
  }, [
    hasFifthCurrency,
    hasFourthCurrency,
    hasThirdCurrency,
    typedValue0,
    typedValue1,
    typedValue2,
    typedValue3,
    typedValue4
  ])

  return formattedCurrencyAmounts
}

export function useAddLiquidityPriceImpact(stableSwapPoolName: StableSwapPoolName, virtualPrice: TokenAmount | null) {
  const { getMinToMint } = useGetEstimatedOutput(stableSwapPoolName)
  const normalizedInputTokenSum = useNormalizedInputTokenSum(stableSwapPoolName)
  const normalizedInputTokenSumString = normalizedInputTokenSum.raw.toString()
  const normalizedInputTokenSumRef = useRef(normalizedInputTokenSumString)
  const [priceImpact, setPriceImpact] = useState(BIG_INT_ZERO)
  const [minToMint, setMinToMint] = useState<CurrencyAmount | null>(null)
  const isHighImpact = isStableSwapHighPriceImpact(priceImpact)

  useEffect(() => {
    async function updatePriceImpact() {
      const minToMint = await getMinToMint()
      const priceImpact = calculatePriceImpact(normalizedInputTokenSum.raw, minToMint.raw, virtualPrice?.raw)

      setPriceImpact(priceImpact)
      setMinToMint(minToMint)
    }

    if (normalizedInputTokenSumString !== normalizedInputTokenSumRef.current) {
      updatePriceImpact().then(() => {
        normalizedInputTokenSumRef.current = normalizedInputTokenSumString
      })
    }
  }, [getMinToMint, normalizedInputTokenSum.raw, normalizedInputTokenSumString, virtualPrice?.raw])

  const priceImpactPercent = JSBI.equal(priceImpact, BIG_INT_ZERO)
    ? null
    : new Percent(priceImpact, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))

  return {
    isBonus: priceImpactPercent?.greaterThan(new Percent('0')) ?? false,
    isHighImpact,
    minToMint: minToMint?.equalTo(BIG_INT_ZERO) === false ? minToMint : null,
    priceImpact: priceImpactPercent
  }
}
