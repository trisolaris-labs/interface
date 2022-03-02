import { ChainId, Token } from '@trisolaris/sdk'
import _ from 'lodash'
import { USDC, USDT } from '../../constants/tokens'

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

export type StableSwapPool = {
  name: StableSwapPoolName
  lpToken: { [chainId in ChainId]: string }
  poolTokens: Token[]

  // Used for Deposits
  // Links to SwapFlashLoan.sol
  addresses: { [chainId in ChainId]: string }
  type: StableSwapPoolTypes
  route: string

  // Used for Swaps
  metaSwapAddresses?: { [chainId in ChainId]: string }
  underlyingPoolTokens?: Token[]
  underlyingPool?: StableSwapPoolName
  isOutdated?: boolean // pool can be outdated but not have a migration target
  rewardPids: { [chainId in ChainId]: number | null }
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

function buildAddresses(addresses: Partial<Record<ChainId, string>>): Record<ChainId, string> {
  return Object.keys(ChainId).reduce((acc, id) => {
    const numId = Number(id) as ChainId
    if (isNaN(numId)) {
      return acc
    }

    return { ...acc, [numId]: addresses?.[numId] ?? '' }
  }, {}) as Record<ChainId, string>
}
function buildPids(pids: Partial<Record<ChainId, number>>): Record<ChainId, number | null> {
  return Object.keys(ChainId).reduce((acc, id) => {
    const numId = Number(id) as ChainId
    if (isNaN(numId)) {
      return acc
    }

    const pid = pids[numId] ?? null
    return { ...acc, [numId]: pid }
  }, {}) as Record<ChainId, number | null>
}

export const STABLESWAP_POOLS: StableSwapPoolsMap = {
  [StableSwapPoolName.USDC_USDT]: {
    name: StableSwapPoolName.USDC_USDT,
    lpToken: buildAddresses({ [ChainId.AURORA]: '0xA601723619a6D1d275cDaa32524f695c21e5E54C' }),
    poolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
    addresses: buildAddresses({
      [ChainId.AURORA]: '0x72ff47B0Df5F8EBD93e4fA4600b89Db693066aa4'
    }),
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    underlyingPoolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
    underlyingPool: StableSwapPoolName.USDC_USDT,
    isOutdated: false,
    rewardPids: buildPids({})
  }
}

export const TOKENS_MAP = _.transform(
  STABLESWAP_POOLS,
  (acc, pool) => {
    pool.poolTokens.forEach(token => {
      if (token?.symbol != null) {
        acc[token.symbol] = token
      }
    })

    // @nocommit we don't need LP tokens here, right?
    // if (pool?.lpToken?.symbol != null) {
    //   acc[pool.lpToken.symbol] = pool.lpToken
    // }

    return acc
  },
  {} as StableSwapTokensMap
)
