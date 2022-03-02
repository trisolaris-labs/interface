import { JSBI, Token } from '@trisolaris/sdk'
import { useCallback, useMemo } from 'react'

import { useActiveWeb3React } from '.'
import {
  StableSwapPool,
  StableSwapPoolName,
  StableSwapPoolsMap,
  StableSwapTokensMap,
  STABLESWAP_POOLS,
  STABLE_SWAP_TYPES,
  TOKENS_MAP
} from '../state/stableswap/constants'
import { setIntersection } from '../utils'
import useStableSwapPoolsStatuses from './useStableSwapPoolsStatuses'

// swaptypes in order of least to most preferred (aka expensive)
const SWAP_TYPES_ORDERED_ASC = [STABLE_SWAP_TYPES.INVALID, STABLE_SWAP_TYPES.DIRECT]

type TokenToPoolsMap = {
  [tokenAddress: string]: StableSwapPoolName[]
}

type TokenToSwapDataMap = { [address: string]: StableSwapData[] }

export function useCalculateStableSwapPairs(): (token?: Token) => StableSwapData[] {
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
          return JSBI.greaterThan(aTVL, bTVL) ? -1 : 1
        }
        return aTVL ? -1 : 1
      })
    const tokenToPools = sortedPools.reduce((acc, { name: poolName }) => {
      const pool = STABLESWAP_POOLS[poolName]
      pool.poolTokens.forEach(token => {
        acc[token.address] = (acc[token.address] || []).concat(poolName)
      })
      return acc
    }, {} as TokenToPoolsMap)

    return [sortedPools, tokenToPools]
  }, [poolsStatuses, chainId])

  return useCallback(
    function calculateSwapPairs(token?: Token): StableSwapData[] {
      if (token == null) {
        return []
      }

      const swapPairs = getTradingPairsForToken(
        TOKENS_MAP,
        STABLESWAP_POOLS,
        poolsSortedByTVL,
        tokenToPoolsMapSorted,
        token
      )

      return swapPairs
    },
    [poolsSortedByTVL, tokenToPoolsMapSorted]
  )
}

function buildSwapSideData(token: Token): SwapSide
function buildSwapSideData(token: Token, pool: StableSwapPool): Required<SwapSide>
function buildSwapSideData(token: Token, pool?: StableSwapPool): Required<SwapSide> | SwapSide {
  return {
    address: token.address,
    poolName: pool?.name,
    tokenIndex: pool?.poolTokens.findIndex(t => t.address === token.address)
  }
}

export type SwapSide = {
  address: string
  poolName?: StableSwapPoolName
  tokenIndex?: number
}

export type StableSwapData =
  | {
      from: Required<SwapSide>
      to: Required<SwapSide>
      type: STABLE_SWAP_TYPES.DIRECT
      route: string[]
    }
  | {
      from: SwapSide
      to: SwapSide
      type: STABLE_SWAP_TYPES.INVALID
      route: string[]
    }

function getTradingPairsForToken(
  tokensMap: StableSwapTokensMap,
  poolsMap: StableSwapPoolsMap,
  poolsSortedByTVL: StableSwapPool[],
  tokenToPoolsMap: TokenToPoolsMap,
  originToken: Token
): StableSwapData[] {
  const allTokens = Object.values(tokensMap).filter(({ address }) => address && tokenToPoolsMap[address])
  const originTokenPoolsSet = new Set(
    originToken.address == null ? [] : (tokenToPoolsMap[originToken.address] ?? []).map(poolName => poolsMap[poolName])
  )
  const tokenToSwapDataMap: { [address: string]: StableSwapData } = {} // object is used for deduping

  allTokens.forEach(token => {
    if (token.address == null || originToken.address == null) {
      return
    }

    // Base Case: Invalid trade, eg token with itself
    let swapData: StableSwapData = {
      from: buildSwapSideData(originToken),
      to: buildSwapSideData(token),
      type: STABLE_SWAP_TYPES.INVALID,
      route: []
    }
    const tokenPoolsSet = new Set(tokenToPoolsMap[token.address].map(poolName => poolsMap[poolName]))
    const sharedPoolsSet = setIntersection(originTokenPoolsSet, tokenPoolsSet)

    if (originToken.address === token.address) {
      // fall through to default "invalid" swapData
    } else if (sharedPoolsSet.size > 0) {
      const tradePool = [...sharedPoolsSet][0]
      swapData = {
        type: STABLE_SWAP_TYPES.DIRECT,
        from: buildSwapSideData(originToken, tradePool),
        to: buildSwapSideData(token, tradePool),
        route: [originToken.address, token.address]
      }
    }

    // use this swap only if we haven't already calculated a better swap for the pair
    const existingTokenSwapData: StableSwapData | undefined = tokenToSwapDataMap[token.address]
    const existingSwapIdx = SWAP_TYPES_ORDERED_ASC.indexOf(existingTokenSwapData?.type)
    const newSwapIdx = SWAP_TYPES_ORDERED_ASC.indexOf(swapData.type)
    if (!existingTokenSwapData || newSwapIdx > existingSwapIdx) {
      tokenToSwapDataMap[token.address] = swapData
    }
  })

  return Object.values(tokenToSwapDataMap)
}
