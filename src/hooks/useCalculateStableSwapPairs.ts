import { Token } from '@trisolaris/sdk'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from '.'
import {
  StableSwapPool,
  StableSwapPoolName,
  StableSwapPoolsMap,
  StableSwapTokensMap,
  STABLESWAP_POOLS,
  SWAP_TYPES,
  TOKENS_MAP
} from '../state/stableswap/constants'
import { setIntersection } from '../utils'
import useStableSwapPoolsStatuses from './useStableSwapPoolsStatuses'

// swaptypes in order of least to most preferred (aka expensive)
const SWAP_TYPES_ORDERED_ASC = [SWAP_TYPES.INVALID, SWAP_TYPES.DIRECT]

type TokenToPoolsMap = {
  [tokenSymbol: string]: StableSwapPoolName[]
}

type TokenToSwapDataMap = { [symbol: string]: SwapData[] }
export function useCalculateSwapPairs(): (token?: Token) => SwapData[] {
  const [pairCache, setPairCache] = useState<TokenToSwapDataMap>({})
  const poolsStatuses = useStableSwapPoolsStatuses()
  const { chainId } = useActiveWeb3React()
  const [poolsSortedByTVL, tokenToPoolsMapSorted] = useMemo(() => {
    const sortedPools = Object.values(STABLESWAP_POOLS)
      .filter(pool => (chainId ? pool.addresses[chainId] : false)) // filter by pools available in the chain
      .filter(pool => !poolsStatuses[pool.name]?.isPaused) // paused pools can't swap
      .sort((a, b) => {
        const aTVL = poolsStatuses[a.name]?.tvl
        const bTVL = poolsStatuses[b.name]?.tvl
        if (aTVL && bTVL) {
          return aTVL.gt(bTVL) ? -1 : 1
        }
        return aTVL ? -1 : 1
      })
    const tokenToPools = sortedPools.reduce((acc, { name: poolName }) => {
      const pool = STABLESWAP_POOLS[poolName]
      pool.poolTokens.forEach(token => {
        if (token?.symbol != null) {
          acc[token.symbol] = (acc[token.symbol] || []).concat(poolName)
        }
      })
      return acc
    }, {} as TokenToPoolsMap)
    return [sortedPools, tokenToPools]
  }, [poolsStatuses, chainId])

  useEffect(() => {
    // @dev clear cache when moving chains
    setPairCache({})
  }, [chainId])

  return useCallback(
    function calculateSwapPairs(token?: Token): SwapData[] {
      if (token?.symbol == null) {
        return []
      }
      const cacheHit = pairCache[token.symbol]
      if (cacheHit) return cacheHit
      const swapPairs = getTradingPairsForToken(
        TOKENS_MAP,
        STABLESWAP_POOLS,
        poolsSortedByTVL,
        tokenToPoolsMapSorted,
        token,
        false // @nocommit Disallow virtual swap
      )
      setPairCache(prevState => (token?.symbol == null ? prevState : { ...prevState, [token.symbol]: swapPairs }))

      return swapPairs
    },
    [poolsSortedByTVL, tokenToPoolsMapSorted, pairCache]
  )
}

function buildSwapSideData(token: Token): SwapSide
function buildSwapSideData(token: Token, pool: StableSwapPool): Required<SwapSide>
function buildSwapSideData(token: Token, pool?: StableSwapPool): Required<SwapSide> | SwapSide {
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    symbol: token.symbol!,
    poolName: pool?.name,
    tokenIndex: pool?.poolTokens.findIndex(t => t === token)
  }
}

export type SwapSide = {
  symbol: string
  poolName?: StableSwapPoolName
  tokenIndex?: number
}

export type SwapData =
  | {
      from: Required<SwapSide>
      to: Required<SwapSide>
      type: SWAP_TYPES.DIRECT
      route: string[]
    }
  | {
      from: SwapSide
      to: SwapSide
      type: SWAP_TYPES.INVALID
      route: string[]
    }

function getTradingPairsForToken(
  tokensMap: StableSwapTokensMap,
  poolsMap: StableSwapPoolsMap,
  poolsSortedByTVL: StableSwapPool[],
  tokenToPoolsMap: TokenToPoolsMap,
  originToken: Token,
  allowVirtualSwap: boolean
): SwapData[] {
  const allTokens = Object.values(tokensMap).filter(({ symbol }) => symbol && tokenToPoolsMap[symbol])
  const originTokenPoolsSet = new Set(
    originToken.symbol == null ? [] : tokenToPoolsMap[originToken.symbol].map(poolName => poolsMap[poolName])
  )
  const tokenToSwapDataMap: { [symbol: string]: SwapData } = {} // object is used for deduping

  allTokens.forEach(token => {
    if (token.symbol == null || originToken.symbol == null) {
      return
    }

    // Base Case: Invalid trade, eg token with itself
    let swapData: SwapData = {
      from: buildSwapSideData(originToken),
      to: buildSwapSideData(token),
      type: SWAP_TYPES.INVALID,
      route: []
    }
    const tokenPoolsSet = new Set(tokenToPoolsMap[token.symbol].map(poolName => poolsMap[poolName]))
    const sharedPoolsSet = setIntersection(originTokenPoolsSet, tokenPoolsSet)

    if (originToken === token) {
      // fall through to default "invalid" swapData
    } else if (sharedPoolsSet.size > 0) {
      const tradePool = [...sharedPoolsSet][0]
      swapData = {
        type: SWAP_TYPES.DIRECT,
        from: buildSwapSideData(originToken, tradePool),
        to: buildSwapSideData(token, tradePool),
        route: [originToken.symbol, token.symbol]
      }
    } else if (!allowVirtualSwap) {
      // fall through to default "invalid" swapData
    }

    // use this swap only if we haven't already calculated a better swap for the pair
    const existingTokenSwapData: SwapData | undefined = tokenToSwapDataMap[token.symbol]
    const existingSwapIdx = SWAP_TYPES_ORDERED_ASC.indexOf(existingTokenSwapData?.type)
    const newSwapIdx = SWAP_TYPES_ORDERED_ASC.indexOf(swapData.type)
    if (!existingTokenSwapData || newSwapIdx > existingSwapIdx) {
      tokenToSwapDataMap[token.symbol] = swapData
    }
  })

  return Object.values(tokenToSwapDataMap)
}

export const __test__ = {
  getTradingPairsForToken
}
