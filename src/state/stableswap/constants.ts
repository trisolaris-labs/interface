import { ChainId, Token, WETH } from '@trisolaris/sdk'
import _ from 'lodash'
import { USDC, USDT, WBTC } from '../../constants/tokens'

export function isLegacySwapABIPool(poolName: string): boolean {
  return new Set(['dummy value']).has(poolName)
}

export function isMetaPool(poolName = ''): boolean {
  return new Set(['dummy value']).has(poolName)
}

export enum STABLE_SWAP_TYPES {
  DIRECT = 'swapDirect', // route length 2
  INVALID = 'invalid'
}

export enum StableSwapPoolName {
  USDC_USDT = 'USDC_USDT'
}

export enum StableSwapPoolTypes {
  BTC,
  ETH,
  USD,
  OTHER
}

export function getTokenForStablePoolType(poolType: StableSwapPoolTypes): Token | null {
  if (poolType === StableSwapPoolTypes.BTC) {
    return WBTC[ChainId.AURORA]
  } else if (poolType === StableSwapPoolTypes.ETH) {
    return WETH[ChainId.AURORA]
  } else if (poolType === StableSwapPoolTypes.USD) {
    return USDC[ChainId.AURORA]
  } else {
    return null
  }
}

export type StableSwapPool = {
  name: StableSwapPoolName
  lpToken: Token
  poolTokens: Token[]

  // Used for Deposits
  // Links to SwapFlashLoan.sol
  address: string
  type: StableSwapPoolTypes
  route: string

  // Used for Swaps
  metaSwapAddresses?: string
  underlyingPoolTokens?: Token[]
  underlyingPool?: StableSwapPoolName
  isOutdated?: boolean // pool can be outdated but not have a migration target
  rewardPids: number | null
}

export type StableSwapPoolsMap = {
  [poolName: string]: StableSwapPool
}

export type StableSwapTokensMap = {
  [symbol: string]: Token
}

export type StableSwapTokenToPoolsMap = {
  [tokenSymbol: string]: string[]
}

export type StableSwapPools = {
  // NOTE - chain id index is AURORA from the enum, are we really gonna deploy this crosschain though
  [ChainId.AURORA]: { [name in StableSwapPoolName]: StableSwapPool }
}

export const STABLESWAP_POOLS: StableSwapPools = {
  [ChainId.AURORA]: {
    [StableSwapPoolName.USDC_USDT]: {
      name: StableSwapPoolName.USDC_USDT,
      // @TODO Move the prod version of this token to the Tokens repo
      lpToken: new Token(
        ChainId.AURORA,
        '0xA601723619a6D1d275cDaa32524f695c21e5E54C',
        18,
        'triTestUSD',
        'TEST Trisolaris USDT/USDC'
      ),
      // *** NOTE *** - For future reference, this order of the pool tokens must be equivalent to the LP token name order
      // Also to verify, please query the swap contract for the individual stable token indexes
      poolTokens: [USDT[ChainId.AURORA], USDC[ChainId.AURORA]],
      address: '0x72ff47B0Df5F8EBD93e4fA4600b89Db693066aa4',
      type: StableSwapPoolTypes.USD,
      route: 'usd',
      underlyingPool: StableSwapPoolName.USDC_USDT,
      isOutdated: false,
      rewardPids: null
    }
  }
}

export const TOKENS_MAP = _.transform(
  STABLESWAP_POOLS[ChainId.AURORA],
  (acc, pool) => {
    pool.poolTokens.forEach(token => {
      if (token?.symbol != null) {
        acc[token.symbol] = token
      }
    })

    return acc
  },
  {} as StableSwapTokensMap
)
