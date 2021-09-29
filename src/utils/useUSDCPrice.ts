// TODO: Actually calculate price

import { ChainId, Currency, currencyEquals, JSBI, Price, WETH } from '@trisolaris/sdk'
import { useMemo } from 'react'
import { DAI } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
	const { chainId } = useActiveWeb3React()
	const wrapped = wrappedCurrency(currency, chainId)
	const USDC = chainId ? DAI[chainId] : DAI[ChainId.AVALANCHE]
	const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
		() => [
			[
				chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
				chainId ? WETH[chainId] : undefined
			],
			[wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.AVALANCHE ? USDC : undefined],
			[chainId ? WETH[chainId] : undefined, chainId === ChainId.AVALANCHE ? USDC : undefined]
		],
		[chainId, currency, wrapped, USDC]
	)
	const [[avaxPairState, avaxPair], [usdcPairState, usdcPair], [usdcAvaxPairState, usdcAvaxPair]] = usePairs(tokenPairs)

	return useMemo(() => {
		if (!currency || !wrapped || !chainId) {
			return undefined
		}
		// handle wavax/avax
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

		const avaxPairAVAXAmount = avaxPair?.reserveOf(WETH[chainId])
		const avaxPairAVAXUSDCValue: JSBI =
			avaxPairAVAXAmount && usdcAvaxPair ? usdcAvaxPair.priceOf(WETH[chainId]).quote(avaxPairAVAXAmount).raw : JSBI.BigInt(0)

		// all other tokens
		// first try the usdc pair
		if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)) {
			const price = usdcPair.priceOf(wrapped)
			return new Price(currency, USDC, price.denominator, price.numerator)
		}
		if (avaxPairState === PairState.EXISTS && avaxPair && usdcAvaxPairState === PairState.EXISTS && usdcAvaxPair) {
			if (usdcAvaxPair.reserveOf(USDC).greaterThan('0') && avaxPair.reserveOf(WETH[chainId]).greaterThan('0')) {
				const avaxUsdcPrice = usdcAvaxPair.priceOf(USDC)
				const currencyAvaxPrice = avaxPair.priceOf(WETH[chainId])
				const usdcPrice = avaxUsdcPrice.multiply(currencyAvaxPrice).invert()
				return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
			}
		}
		return undefined
	}, [chainId, currency, avaxPair, avaxPairState, usdcAvaxPair, usdcAvaxPairState, usdcPair, usdcPairState, wrapped, USDC])
}