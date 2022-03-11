// TODO: Actually calculate price

import { ChainId, Currency, currencyEquals, JSBI, Price, WETH } from '@trisolaris/sdk'
import { useMemo } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { USDC as usdcDef, USDT as usdtDef } from '../constants/tokens'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '.'
import { wrappedCurrency } from '../utils/wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)

  const USDC = chainId ? usdcDef[chainId] : usdcDef[ChainId.AURORA]
  const USDT = chainId ? usdtDef[chainId] : usdtDef[ChainId.AURORA]

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
      return new Price(USDC, USDC, '1', '1')
    }

    // handle usdt
    if (wrapped.equals(USDT)) {
      return new Price(USDT, USDT, '1', '1')
    }


    const currencyEthPairWETHAmount = currencyEth?.reserveOf(WETH[chainId])
    const currencyEthPairWETHUSDCValue: JSBI =
      currencyEthPairWETHAmount && usdcEthPair
        ? usdcEthPair.priceOf(WETH[chainId]).quote(currencyEthPairWETHAmount).raw
        : BIG_INT_ZERO

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(USDC).greaterThan(currencyEthPairWETHUSDCValue)
    ) {
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
