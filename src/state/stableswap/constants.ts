import { ChainId, Token, WETH } from '@trisolaris/sdk'
import _ from 'lodash'
import { FRAX, USDC, USDT, WBTC, WUST } from '../../constants/tokens'

export function isLegacySwapABIPool(poolName: string): boolean {
  return new Set(['dummy value']).has(poolName)
}

export function isMetaPool(poolName?: StableSwapPoolName): boolean {
  const metapools = new Set<StableSwapPoolName | undefined>()

  return metapools.has(poolName)
}

export enum STABLE_SWAP_TYPES {
  DIRECT = 'swapDirect', // route length 2
  INVALID = 'invalid'
}

export enum StableSwapPoolName {
  USDC_USDT = 'USDC_USDT',
  USDC_USDT_WUST_FRAX = 'USDC_USDT_WUST_FRAX'
}

export enum StableSwapPoolTypes {
  BTC,
  ETH,
  USD,
  OTHER
}

export function getTokenForStablePoolType(poolType: StableSwapPoolTypes): Token {
  if (poolType === StableSwapPoolTypes.BTC) {
    return WBTC[ChainId.AURORA]
  } else if (poolType === StableSwapPoolTypes.ETH) {
    return WETH[ChainId.AURORA]
  } else if (poolType === StableSwapPoolTypes.USD) {
    return USDC[ChainId.AURORA]
  } else {
    throw new Error('[getTokenForStablePoolType] Error getting token')
  }
}

export type StableSwapPool = {
  name: StableSwapPoolName
  lpToken: Token

  // These are the tokens in the pool (don't put LP tokens here)
  poolTokens: { 0: Token; 1: Token } & Array<Token>

  // Used for Deposits
  // Links to SwapFlashLoan.sol
  address: string
  type: StableSwapPoolTypes
  route: string

  // Used for Swaps
  metaSwapAddresses?: string

  // These are the actual tokens in the pool (LP tokens should be at the end)
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

export type StableSwapPools = { [name in StableSwapPoolName]: StableSwapPool }

export const STABLESWAP_POOLS: StableSwapPools = {
  [StableSwapPoolName.USDC_USDT]: {
    name: StableSwapPoolName.USDC_USDT,
    // @TODO Move the prod version of this token to the Tokens repo
    lpToken: new Token(
      ChainId.AURORA,
      '0x5EB99863f7eFE88c447Bc9D52AA800421b1de6c9',
      18,
      'USDTLP',
      'Trisolaris USDC/USDT'
    ),
    // *** NOTE *** - For future reference, this order of the pool tokens must be equivalent to the LP token name order
    // Also to verify, please query the swap contract for the individual stable token indexes
    poolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
    address: '0x13e7a001EC72AB30D66E2f386f677e25dCFF5F59',
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    isOutdated: false,
    rewardPids: null
  },
  [StableSwapPoolName.USDC_USDT_WUST_FRAX]: {
    name: StableSwapPoolName.USDC_USDT_WUST_FRAX,
    lpToken: new Token(
      ChainId.AURORA,
      '0xcdb578ba21c65dbab2f2aa1ce912d689affda911',
      18,
      'USD TLP',
      'UST_FRAX_USDC_USDT'
    ),
    poolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA], WUST[ChainId.AURORA], FRAX[ChainId.AURORA]],
    address: '0x21e756AF5a42838B4f17C3A70a395D3048da81D8',
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    isOutdated: false,
    rewardPids: null
  }
}

export const TOKENS_MAP = _.transform(
  STABLESWAP_POOLS,
  (acc, pool) => {
    pool.poolTokens?.forEach(token => {
      if (token?.symbol != null) {
        acc[token.symbol] = token
      }
    })

    return acc
  },
  {} as StableSwapTokensMap
)
