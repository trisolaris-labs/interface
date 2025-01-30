import {
  TokenAmount,
  Pair,
  Currency,
  ChainId,
  BigintIsh,
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  Token,
  INIT_CODE_HASH,
  Price,
  InsufficientInputAmountError,
  InsufficientReservesError,
  JSBI,
  MINIMUM_LIQUIDITY
} from '@trisolaris/sdk'

import { useMemo } from 'react'
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { TURBO } from '../constants/chains'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'
import { useActiveWeb3React } from '../hooks'
import { pack, keccak256 } from '@ethersproject/solidity'
import { getCreate2Address } from '@ethersproject/address'
import invariant from 'tiny-invariant'

const PAIR_INTERFACE = new Interface(IUniswapV2Pair_ABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export const LOCAL_FACTORY_ADDRESS = {
  ...FACTORY_ADDRESS,
  [TURBO]: '0xf0BE0075F8De10044a7115FdCf7feC3afB3B8FE0'
}

export const LOCAL_ROUTER_ADDRESS = {
  ...ROUTER_ADDRESS,
  [TURBO]: '0x317f7714F49efCFdBF150640cf9E73C136676c0c'
}

export const LOCAL_INIT_CODE_HASH = {
  ...INIT_CODE_HASH,
  [TURBO]: '0x754e1d90e536e4c1df81b7f030f47b4ca80c87120e145c294f098c83a6cb5ace'
}


export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? Pair.getAddress(tokenA, tokenB, chainId ?? ChainId.AURORA)
          : undefined
      }),
    [tokens, chainId]
  )
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, reserve0.toString()),
          new TokenAmount(token1, reserve1.toString()),
          chainId
        )
      ]
    }) as [PairState, Pair | null][]
  }, [results, tokens, chainId])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
