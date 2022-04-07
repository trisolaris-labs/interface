import { ChainId, Token, WETH } from '@trisolaris/sdk'
import _ from 'lodash'
import { USDC, USDT, UST, WBTC } from '../../constants/tokens'

export function isLegacySwapABIPool(poolName: string): boolean {
  return new Set(['dummy value']).has(poolName)
}

export function isMetaPool(poolName: StableSwapPoolName | undefined): boolean {
  if (!poolName) {
    return false
  }
  return new Set([StableSwapPoolName.META_UST]).has(poolName)
}

export enum STABLE_SWAP_TYPES {
  DIRECT = 'swapDirect', // route length 2
  INVALID = 'invalid'
}

export enum StableSwapPoolName {
  META_UST = 'META_UST',
  USDC_USDT = 'USDC_USDT'
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
  poolTokens: Token[]

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
        '0x5EB99863f7eFE88c447Bc9D52AA800421b1de6c9',
        18,
        'USD TLP',
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
    [StableSwapPoolName.META_UST]: {
      name: StableSwapPoolName.META_UST,
      // @TODO Move the prod version of this token to the Tokens repo
      lpToken: new Token(ChainId.AURORA, '0x2fB7f5A8386bcFf6452AFFF1f9C2BAcC4cacdDFb', 18, 'UST TLP', 'TEST Meta UST'),
      // *** NOTE *** - For future reference, this order of the pool tokens must be equivalent to the LP token name order
      // Also to verify, please query the swap contract for the individual stable token indexes
      poolTokens: [UST[ChainId.AURORA], USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
      address: '0x264e4B3F80f62442C812F9D08F7f8b77B2c70FD4', // NOTE - MetaSwapDeposit contract address, multicall queries error, maybe because no liquidity first?
      type: StableSwapPoolTypes.USD,
      route: 'usd',
      underlyingPoolTokens: [
        UST[ChainId.AURORA],
        new Token(ChainId.AURORA, '0x5EB99863f7eFE88c447Bc9D52AA800421b1de6c9', 18, 'USD TLP', 'Trisolaris USDC/USDT')
      ],
      underlyingPool: StableSwapPoolName.USDC_USDT,
      isOutdated: false,
      rewardPids: null
    }
  }
}

export const TOKENS_MAP = _.transform(
  STABLESWAP_POOLS[ChainId.AURORA],
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
