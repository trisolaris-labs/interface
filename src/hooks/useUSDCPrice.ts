import { ChainId, Currency, currencyEquals, JSBI, Price, WETH } from '@trisolaris/sdk'
import { useMemo } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { AUUSDC as auUsdcDef, AUUSDT as auUsdtDef, USDC as usdcDef, USDT as usdtDef } from '../constants/tokens'
import { PairState, usePairs } from '../data/Reserves'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { useAuTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { NETWORK_CHAIN_ID } from '../connectors'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const chainId = NETWORK_CHAIN_ID
  const wrapped = wrappedCurrency(currency, chainId)

  const USDC = usdcDef[ChainId.AURORA]

  const USDT = usdtDef[ChainId.AURORA]

  const AUUSDT = auUsdtDef[ChainId.AURORA]

  const AUUSDC = auUsdcDef[ChainId.AURORA]

  const auUSDCContract = useAuTokenContract(AUUSDC.address)
  const auUSDTContract = useAuTokenContract(AUUSDT.address)

  const auUSDCExchangeRate: JSBI = JSBI.BigInt(
    useSingleCallResult(auUSDCContract, 'exchangeRateStored')?.result?.[0] ?? 0
  )
  const auUSDTExchangeRate: JSBI = JSBI.BigInt(
    useSingleCallResult(auUSDTContract, 'exchangeRateStored')?.result?.[0] ?? 0
  )

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,

        chainId ? WETH[chainId] : undefined
      ],
      [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.AURORA ? USDC : undefined],

      [chainId ? WETH[chainId] : undefined, chainId === ChainId.AURORA ? USDC : undefined]
    ],
    [chainId, currency, wrapped, USDC]
  )
  const [[currencyEthState, currencyEth], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(
    tokenPairs
  )

  const calculateAuUSDCExchangeRate = useMemo(() => {
    return JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(8))), // need to escalate up/down the amount to 1e8 to calculate * exchange rato
        auUSDCExchangeRate
      ),
      JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
    )
  }, [auUSDCExchangeRate])

  const calculateAuUSDTExchangeRate = useMemo(() => {
    return JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(8))), // need to escalate up/down the amount to 1e8 to calculate * exchange rato
        auUSDTExchangeRate
      ),
      JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
    )
  }, [auUSDTExchangeRate])

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WETH[chainId])

        return new Price(currency, USDC, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(USDC)) {
      return new Price(
        USDC,
        USDC,
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(wrapped.decimals))),
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(wrapped.decimals)))
      )
    }

    // handle usdt
    if (wrapped.equals(USDT)) {
      return new Price(
        USDT,
        USDC,
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(wrapped.decimals))),
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(wrapped.decimals)))
      )
    }

    // handle Aurigami exchange rates
    if (wrapped.equals(AUUSDC) || wrapped.equals(AUUSDT)) {
      const exchangeRate = wrapped.equals(AUUSDC) ? calculateAuUSDCExchangeRate : calculateAuUSDTExchangeRate
      return new Price(
        wrapped,
        USDC,
        JSBI.multiply(JSBI.BigInt(1), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(wrapped.decimals))),
        exchangeRate
      )
    }

    const currencyEthPairWETHAmount = currencyEth?.reserveOf(WETH[chainId])
    const currencyEthPairWETHUSDCValue: JSBI =
      currencyEthPairWETHAmount && usdcEthPair
        ? usdcEthPair.priceOf(WETH[chainId]).quote(currencyEthPairWETHAmount).raw
        : BIG_INT_ZERO

    // all other tokens
    // first try the usdc pair
    if (usdcPairState === PairState.EXISTS && usdcPair?.reserveOf(USDC).greaterThan(currencyEthPairWETHUSDCValue)) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (currencyEthState === PairState.EXISTS && currencyEth && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (usdcEthPair.reserveOf(USDC).greaterThan('0') && currencyEth.reserveOf(WETH[chainId]).greaterThan('0')) {
        const usdcPriceInEth = usdcEthPair.priceOf(USDC)
        const ethPriceInCurrency = currencyEth.priceOf(WETH[chainId])
        const currencyUsdcPrice = usdcPriceInEth.multiply(ethPriceInCurrency).invert()
        return new Price(currency, USDC, currencyUsdcPrice.denominator, currencyUsdcPrice.numerator)
      }
    }
    return undefined
  }, [
    chainId,
    currency,
    currencyEth,
    currencyEthState,
    usdcEthPair,
    usdcEthPairState,
    usdcPair,
    usdcPairState,
    wrapped,
    USDC
  ])
}
