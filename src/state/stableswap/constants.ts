import { ChainId, Token, WETH } from '@trisolaris/sdk'
import _ from 'lodash'
import { FRAX, USDC, USDT, WBTC, UST, USN, NUSD } from '../../constants/tokens'

export function isLegacySwapABIPool(poolName: string): boolean {
  return new Set(['dummy value']).has(poolName)
}

export function isMetaPool(poolName?: StableSwapPoolName): boolean {
  const metapools = new Set<StableSwapPoolName | undefined>([StableSwapPoolName.NUSD_USDC_USDT])

  return metapools.has(poolName)
}

export enum STABLE_SWAP_TYPES {
  DIRECT = 'swapDirect', // route length 2
  INVALID = 'invalid'
}

export enum StableSwapPoolName {
  USDC_USDT = 'USDC_USDT',
  USDC_USDT_UST_FRAX_USN = 'USDC_USDT_UST_FRAX_USN',
  USDC_USDT_USN = 'USDC_USDT_USN',
  USDC_USDT_NEW = 'USDC_USDT_NEW',
  NUSD_USDC_USDT = 'NUSD_USDC_USDT'
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
  friendlyName: string
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

  // UI Gating
  disableAddLiquidity?: boolean
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
    friendlyName: 'USDC/USDT (Deprecated)',
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
  [StableSwapPoolName.USDC_USDT_UST_FRAX_USN]: {
    name: StableSwapPoolName.USDC_USDT_UST_FRAX_USN,
    friendlyName: 'USDC/USDT/UST/FRAX/USN (Deprecated)',
    lpToken: new Token(
      ChainId.AURORA,
      '0x467171053355Da79409bf2F931D21ab1f24Fe0A6',
      18,
      'USD TLP',
      'USDC/USDT/UST/FRAX/USN'
    ),
    poolTokens: [
      USDC[ChainId.AURORA],
      USDT[ChainId.AURORA],
      UST[ChainId.AURORA],
      FRAX[ChainId.AURORA],
      USN[ChainId.AURORA]
    ],
    address: '0xdd407884589b23d2155923b8178bAA0c5725ad9c',
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    isOutdated: false,
    rewardPids: null,
    disableAddLiquidity: true
  },
  [StableSwapPoolName.USDC_USDT_USN]: {
    name: StableSwapPoolName.USDC_USDT_USN,
    friendlyName: 'USDC/USDT/USN',
    lpToken: new Token(ChainId.AURORA, '0x87BCC091d0A7F9352728100268Ac8D25729113bB', 18, 'USD TLP', 'USDC/USDT/USN'),
    poolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA], USN[ChainId.AURORA]],
    address: '0x458459E48dbAC0C8Ca83F8D0b7b29FEfE60c3970',
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    isOutdated: false,
    rewardPids: null
  },
  [StableSwapPoolName.USDC_USDT_NEW]: {
    name: StableSwapPoolName.USDC_USDT_NEW,
    friendlyName: 'USDC/USDT',
    lpToken: new Token(
      ChainId.AURORA,
      '0x3fADE6094373f7A91A91D4607b226791fB3BCEAf',
      18,
      'USDC/USDT TLP',
      'Trisolaris USDC/USDT'
    ),
    poolTokens: [USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
    address: '0x51d96EF6960cC7b4C884E1215564f926011A4064',
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    isOutdated: false,
    rewardPids: null
  },
  [StableSwapPoolName.NUSD_USDC_USDT]: {
    name: StableSwapPoolName.NUSD_USDC_USDT,
    friendlyName: 'nUSD-USDC/USDT',
    lpToken: new Token(
      ChainId.AURORA,
      '0xffb69779f14E851A8c550Bf5bB1933c44BBDE129',
      18,
      'nUSD-USDC/USDT TLP',
      'Trisolaris nUSD-USDC/USDT'
    ),
    poolTokens: [NUSD[ChainId.AURORA], USDC[ChainId.AURORA], USDT[ChainId.AURORA]],
    address: '0x3CE7AAD78B9eb47Fd2b487c463A17AAeD038B7EC', // MetaSwap
    metaSwapAddresses: '0xCCd87854f58773fe75CdDa542457aC48E46c2D65', // MetaSwapDeposit
    type: StableSwapPoolTypes.USD,
    route: 'usd',
    underlyingPoolTokens: [
      NUSD[ChainId.AURORA],
      new Token(
        ChainId.AURORA,
        '0x3fADE6094373f7A91A91D4607b226791fB3BCEAf',
        18,
        'USDC/USDT TLP',
        'Trisolaris USDC/USDT'
      )
    ],
    underlyingPool: StableSwapPoolName.USDC_USDT,
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
