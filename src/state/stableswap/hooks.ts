import { parseUnits } from '@ethersproject/units'
import { ChainId, Currency, CurrencyAmount, Fraction, JSBI, Price, Token, TokenAmount, Trade } from '@trisolaris/sdk'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances, useTokenBalance } from '../wallet/hooks'
import { Field, replaceStableSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { StableSwapState } from './reducer'
import { useUserSlippageTolerance } from '../user/hooks'
import { useTranslation } from 'react-i18next'
import { BIG_INT_ZERO } from '../../constants'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { StableSwapData, useCalculateStableSwapPairs } from '../../hooks/useCalculateStableSwapPairs'
import { useStableSwapContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../multicall/hooks'
import { STABLE_SWAP_TYPES } from './constants'
import _ from 'lodash'
import { Contract } from 'ethers'
import { USDC } from '../../constants/tokens'

const NATIVE_USDC = USDC[ChainId.AURORA]

export type StableSwapTrade = {
  contract: Contract
  executionPrice: Price
  inputAmount: CurrencyAmount
  stableSwapData: StableSwapData
  outputAmount: CurrencyAmount
}

export function useStableSwapState(): AppState['stableswap'] {
  return useSelector<AppState, AppState['stableswap']>(state => state.stableswap)
}

export function useStableSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : ''
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function useSelectedStableSwapPool() {
  const { chainId } = useActiveWeb3React()
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId }
  } = useStableSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const calculateStableSwapPairs = useCalculateStableSwapPairs()

  const inputToken = wrappedCurrency(inputCurrency ?? undefined, chainId)
  const outputToken = wrappedCurrency(outputCurrency ?? undefined, chainId)

  const selectedStableSwapPool = useMemo(() => {
    if (chainId == null || inputToken == null || outputToken == null) {
      return
    }

    const outputTokens = calculateStableSwapPairs(inputToken)

    return _(outputTokens).find(
      stableSwapData =>
        stableSwapData.from.address === inputToken.address &&
        stableSwapData.to.address === outputToken.address &&
        stableSwapData.type !== STABLE_SWAP_TYPES.INVALID
    )
  }, [calculateStableSwapPairs, chainId, inputToken, outputToken])

  return selectedStableSwapPool
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedStableSwapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  inputError?: string
  stableSwapTrade: StableSwapTrade | undefined
} {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient
  } = useStableSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientAddress = isAddress(recipient)
  const to: string | null = (recipientAddress ? recipientAddress : account) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined
  ])

  const parsedAmount = tryParseAmount(typedValue, inputCurrency ?? undefined)

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1]
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined
  }

  const inputToken = wrappedCurrency(currencies?.[Field.INPUT], chainId)
  const selectedStableSwapPool = useSelectedStableSwapPool()
  const stableSwapContract = useStableSwapContract(selectedStableSwapPool?.to?.poolName, true)
  const calculateSwapResponse = useSingleCallResult(stableSwapContract, 'calculateSwap', [
    selectedStableSwapPool?.from.tokenIndex ?? 0,
    selectedStableSwapPool?.to.tokenIndex ?? 0,
    parsedAmount?.raw.toString()
  ])

  const amountToReceive = calculateSwapResponse?.result?.[0] ?? BIG_INT_ZERO
  const amountIn = useTokenBalance(account ?? undefined, inputToken)
  const [allowedSlippage] = useUserSlippageTolerance()
  const tokenFrom = currencies[Field.INPUT]
  const tokenTo = currencies[Field.OUTPUT]

  let inputError: string | undefined

  switch (true) {
    case !account: {
      inputError = t('swapHooks.connectWallet')
      break
    }
    case !parsedAmount: {
      inputError = inputError ?? t('swapHooks.enterAmount')
      break
    }
    case !currencies[Field.INPUT] || !currencies[Field.OUTPUT]: {
      inputError = inputError ?? t('swapHooks.selectToken')
      break
    }
    case !to || !isAddress(to): {
      inputError = inputError ?? t('swapHooks.enterRecipient')
      break
    }
    case parsedAmount == null || amountIn == null || parsedAmount.greaterThan(amountIn ?? BIG_INT_ZERO): {
      inputError = t('swapHooks.insufficient') + (amountIn?.currency.symbol ?? '') + t('swapHooks.balance')
      break
    }
  }

  // @TODO - add price impact: See src/pages/Swap.tsx#L305
  let tradeData

  if (
    stableSwapContract != null &&
    parsedAmount != null &&
    selectedStableSwapPool != null &&
    tokenTo != null &&
    tokenFrom != null &&
    amountToReceive != null
  ) {
    const amountToReceiveJSBI = JSBI.BigInt(amountToReceive)
    const amountOutLessSlippage = new Fraction(JSBI.BigInt(1))
      .add(JSBI.BigInt(allowedSlippage))
      .invert()
      .multiply(amountToReceiveJSBI).quotient

    const executionPrice = JSBI.LE(amountOutLessSlippage, BIG_INT_ZERO)
      ? new Price(tokenFrom, tokenTo, JSBI.BigInt(1), BIG_INT_ZERO)
      : new Price(tokenFrom, tokenTo, amountToReceiveJSBI, amountOutLessSlippage)

    tradeData = {
      contract: stableSwapContract,
      executionPrice,
      inputAmount: parsedAmount,
      stableSwapData: selectedStableSwapPool,
      outputAmount: CurrencyAmount.fromRawAmount(tokenTo, amountToReceiveJSBI)
    }
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    stableSwapTrade: tradeData
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (valid === false) return NATIVE_USDC.address ?? ''
  }
  return NATIVE_USDC.address ?? ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(parsedQs: ParsedQs): StableSwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs)

    dispatch(
      replaceStableSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: parsed.recipient
      })
    )

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}

export function useStableSwapSelectedOutputPoolWrapped(): (
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined
) => StableSwapData | undefined {
  const calculateStableSwapPairs = useCalculateStableSwapPairs()
  const { chainId } = useActiveWeb3React()

  return useCallback(
    (inputCurrency: Currency | undefined, outputCurrency: Currency | undefined) => {
      const inputToken = wrappedCurrency(inputCurrency, chainId)
      const outputToken = wrappedCurrency(outputCurrency, chainId)

      if (chainId == null || inputToken == null || outputToken == null) {
        return
      }

      const outputTokens = calculateStableSwapPairs(inputToken)

      return _(outputTokens).find(
        stableSwapData =>
          stableSwapData.from.address === inputToken.address &&
          stableSwapData.to.address === outputToken.address &&
          stableSwapData.type !== STABLE_SWAP_TYPES.INVALID
      )
    },
    [calculateStableSwapPairs, chainId]
  )
}

export function useStableSwapSelectedOutputPool(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined
): StableSwapData | undefined {
  const stableSwapSelectedOutputPool = useStableSwapSelectedOutputPoolWrapped()

  return useMemo(() => stableSwapSelectedOutputPool(inputCurrency, outputCurrency), [
    inputCurrency,
    outputCurrency,
    stableSwapSelectedOutputPool
  ])
}
