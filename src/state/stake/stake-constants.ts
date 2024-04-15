import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import _ from 'lodash'
import { ZERO_ADDRESS } from '../../constants'
import {
  USDC,
  AAVE,
  DAI,
  WNEAR,
  USDT,
  WBTC,
  TRI,
  AURORA,
  ATLUNA,
  ATUST,
  BNB,
  AVAX,
  MATIC,
  FLX,
  MECHA,
  SOLACE,
  STNEAR,
  XTRI,
  XNL,
  GBA,
  AUSDO,
  BBT,
  SHITZU,
  ROSE,
  RUSD,
  LINEAR,
  BSTN,
  KSW,
  SMARTPAD,
  BRRR,
  USN,
  REF,
  META,
  PLY,
  NEARX,
  NSTART,
  BAT,
  STAUR,
  USDC_E,
  USDT_E
} from '../../constants/tokens'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../stableswap/constants'
import { MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from './hooks-sushi'

export enum ChefVersions {
  V1,
  V2
}

export enum PoolType {
  TRI_ONLY = 'TRI Pool',
  DUAL_REWARDS = 'Dual Rewards',
  ECOSYSTEM = 'Ecosystem',
  STABLE = 'Stable Pool',
  LEGACY = 'Legacy',
  MULTIPLE = 'Mult. Rewards'
}

export type StakingTri = StakingTriStakedAmounts & StakingTriFarms
export type NonTriAPR = { address: string; apr: number }
export type EarnedNonTriRewards = { token: Token; amount: TokenAmount }
export type StakingTriStakedAmounts = {
  ID: number
  stakedAmount: TokenAmount | null
}
export type StakingTriFarms = {
  ID: number
  poolId: number
  tokens: { 0: Token; 1: Token } & Array<Token>
  stakingRewardAddress: string
  lpAddress: string
  rewarderAddress: string
  isPeriodFinished: boolean
  earnedAmount: TokenAmount
  totalStakedAmount: TokenAmount
  totalStakedInUSD: number
  allocPoint: number
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: number
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  apr: number
  nonTriAPRs: NonTriAPR[]
  earnedNonTriRewards: EarnedNonTriRewards[]
  chefVersion: ChefVersions
  hasNonTriRewards: boolean
  inStaging: boolean
  noTriRewards: boolean
  stableSwapPoolName: StableSwapPoolName | null
  friendlyFarmName: string | null
  isFeatured: boolean
  poolType: PoolType
  zapEnabled: boolean
}

export interface ExternalInfo {
  id: number
  lpAddress: string
  totalSupply: number
  totalStaked: number
  totalStakedInUSD: number
  totalRewardRate: number
  allocPoint: number
  apr: number
  nonTriAPRs: NonTriAPR[]
}

export const dummyToken = new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

const dummyAmount = new TokenAmount(dummyToken, '0')

const NULL_POOL: StakingTri = {
  ID: 0,
  poolId: 0,
  tokens: [
    new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO'),
    new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')
  ],
  stakingRewardAddress: ZERO_ADDRESS,
  lpAddress: ZERO_ADDRESS,
  rewarderAddress: '',
  isPeriodFinished: false,
  stakedAmount: dummyAmount,
  earnedAmount: dummyAmount,
  totalStakedAmount: dummyAmount,
  totalStakedInUSD: 0,
  allocPoint: 0,
  totalRewardRate: 1,
  rewardRate: dummyAmount,
  apr: 0,
  nonTriAPRs: [],
  chefVersion: ChefVersions.V1,
  hasNonTriRewards: false,
  inStaging: false,
  noTriRewards: false,
  earnedNonTriRewards: [],
  stableSwapPoolName: null,
  friendlyFarmName: null,
  isFeatured: false,
  poolType: PoolType.TRI_ONLY,
  zapEnabled: false
}
const NULL_POOLS = [NULL_POOL]

/**
 * Creates a pool
 * Only set properties that are different than the `NULL_POOL`
 * @param poolData
 * @returns StakingTri
 */
function createPool(...poolData: Partial<StakingTri>[]): StakingTri {
  return _.defaultsDeep({}, ...poolData, NULL_POOL)
}

type TCreateMCPool = Omit<Partial<StakingTri>, 'stakingRewardAddress' | 'chefVersion'>

/**
 * Creates a MasterChefV1 pool
 * Only set properties that are different than the `NULL_POOL`
 * @param poolData
 * @returns StakingTri
 */
function createMCV1Pool(poolData: TCreateMCPool): StakingTri {
  const masterchefV1Props = {
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    chefVersion: ChefVersions.V1
  }
  return createPool(poolData, masterchefV1Props, NULL_POOL)
}

/**
 * Creates a MasterChefV2 pool
 * Only set properties that are different than the `NULL_POOL`
 * @param poolData
 * @returns StakingTri
 */
function createMCV2Pool(poolData: TCreateMCPool): StakingTri {
  const masterchefV2Props = {
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    chefVersion: ChefVersions.V2
  }
  return createPool(poolData, masterchefV2Props, NULL_POOL)
}

export const rewardsPerSecond = JSBI.BigInt('10000000000000000000')
export const totalAllocPoints = JSBI.BigInt('5')
export const tokenAmount = new TokenAmount(dummyToken, '99')

const POLYGON_POOLS: StakingTri[] = [
  createPool({
    ID: 0,
    poolId: 0,
    tokens: [DAI[ChainId.POLYGON], USDC_E[ChainId.POLYGON]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.POLYGON],
    lpAddress: '0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f',
    allocPoint: 1
  }),
  createPool({
    ID: 1,
    poolId: 1,
    tokens: [AAVE[ChainId.POLYGON], DAI[ChainId.POLYGON]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.POLYGON],
    lpAddress: '0x76F4128B11f429289499BA29518Ef7E5b26025B6',
    allocPoint: 1
  })
]

const AURORA_POOLS: StakingTri[] = [
  createMCV1Pool({
    ID: 0,
    poolId: 0,
    tokens: [WETH[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    lpAddress: '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV1Pool({
    ID: 1,
    poolId: 1,
    tokens: [WNEAR[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV1Pool({
    ID: 2,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV1Pool({
    ID: 3,
    poolId: 3,
    tokens: [USDT_E[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV1Pool({
    ID: 4,
    poolId: 4,
    tokens: [WNEAR[ChainId.AURORA], WBTC[ChainId.AURORA]],
    lpAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV1Pool({
    ID: 5,
    poolId: 5,
    tokens: [TRI[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV1Pool({
    ID: 6,
    poolId: 6,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 7,
    poolId: 0,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY
  }),
  createMCV2Pool({
    ID: 8,
    poolId: 1,
    tokens: [TRI[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0xd1654a7713617d41A8C9530Fb9B948d00e162194',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY
  }),
  createMCV2Pool({
    ID: 9,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], ATLUNA[ChainId.AURORA]],
    lpAddress: '0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914',
    rewarderAddress: '0x89F6628927fdFA2592E016Ba5B14389a4b08D681',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 10,
    poolId: 3,
    tokens: [WNEAR[ChainId.AURORA], ATUST[ChainId.AURORA]],
    lpAddress: '0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90',
    rewarderAddress: '0x17d1597ec86fD6aecbfE0F32Ab2F2aD9c37E6750',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 11,
    poolId: 4,
    tokens: [TRI[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c',
    allocPoint: 1,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 12,
    poolId: 5,
    tokens: [WNEAR[ChainId.AURORA], AVAX[ChainId.AURORA]],
    lpAddress: '0x6443532841a5279cb04420E61Cf855cBEb70dc8C',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 13,
    poolId: 6,
    tokens: [WNEAR[ChainId.AURORA], BNB[ChainId.AURORA]],
    lpAddress: '0x7be4a49AA41B34db70e539d4Ae43c7fBDf839DfA',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 14,
    poolId: 7,
    tokens: [WNEAR[ChainId.AURORA], MATIC[ChainId.AURORA]],
    lpAddress: '0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 15,
    poolId: 8,
    tokens: [WNEAR[ChainId.AURORA], FLX[ChainId.AURORA]],
    lpAddress: '0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09',
    rewarderAddress: '0x42b950FB4dd822ef04C4388450726EFbF1C3CF63',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 16,
    poolId: 9,
    tokens: [WNEAR[ChainId.AURORA], MECHA[ChainId.AURORA]],
    lpAddress: '0xd62f9ec4C4d323A0C111d5e78b77eA33A2AA862f',
    rewarderAddress: '0x9847F7e33CCbC0542b05d15c5cf3aE2Ae092C057',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 17,
    poolId: 10,
    tokens: [WNEAR[ChainId.AURORA], SOLACE[ChainId.AURORA]],
    lpAddress: '0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2',
    rewarderAddress: '0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 18,
    poolId: 11,
    tokens: [XTRI[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    lpAddress: '0x5913f644A10d98c79F2e0b609988640187256373',
    rewarderAddress: '0x7B9e31BbEdbfdc99e3CC8b879b9a3B1e379Ce530',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 19,
    poolId: 12,
    tokens: [WNEAR[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    lpAddress: '0x47924Ae4968832984F4091EEC537dfF5c38948a4',
    rewarderAddress: '0xf267212F1D8888e0eD20BbB0c7C87A089cDe6E88',
    allocPoint: 1,
    isFeatured: true,
    poolType: PoolType.DUAL_REWARDS,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 20,
    poolId: 13,
    tokens: [AURORA[ChainId.AURORA], XNL[ChainId.AURORA]],
    lpAddress: '0xb419ff9221039Bdca7bb92A131DD9CF7DEb9b8e5',
    rewarderAddress: '0xb84293D04137c9061afe34118Dac9931df153826',
    allocPoint: 1,
    noTriRewards: true,
    poolType: PoolType.ECOSYSTEM
  }),
  createMCV2Pool({
    ID: 21,
    poolId: 14,
    tokens: [WNEAR[ChainId.AURORA], XNL[ChainId.AURORA]],
    lpAddress: '0xFBc4C42159A5575a772BebA7E3BF91DB508E127a',
    rewarderAddress: '0x028Fbc4BB5787e340524EF41d95875Ac2C382101',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 22,
    poolId: 15,
    tokens: [USDT_E[ChainId.AURORA], GBA[ChainId.AURORA]],
    lpAddress: '0x7B273238C6DD0453C160f305df35c350a123E505',
    rewarderAddress: '0xDAc58A615E2A1a94D7fb726a96C273c057997D50',
    allocPoint: 1,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 23,
    poolId: 16,
    tokens: [USDT_E[ChainId.AURORA], AUSDO[ChainId.AURORA]],
    lpAddress: '0x6277f94a69Df5df0Bc58b25917B9ECEFBf1b846A',
    rewarderAddress: '0x170431D69544a1BC97855C6564E8460d39508844',
    allocPoint: 1,
    inStaging: false,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 24,
    poolId: 17,
    tokens: [WNEAR[ChainId.AURORA], BBT[ChainId.AURORA]],
    lpAddress: '0xadAbA7E2bf88Bd10ACb782302A568294566236dC',
    rewarderAddress: '0x41A7e26a2cC7DaDc5A31fE9DD77c30Aeb029184d',
    allocPoint: 1,
    inStaging: false,
    noTriRewards: true,
    poolType: PoolType.ECOSYSTEM
  }),
  // Needed to add the this pool due to some functions and features breaking when jumping from ID 24 to 26.
  // TODO:  Will be replaced by stable farm pool in stable farms PR.
  createMCV2Pool({
    ID: 25,
    poolId: 18,
    tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_E_USDT_E].poolTokens,
    lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_E_USDT_E].lpToken.address,
    rewarderAddress: '',
    allocPoint: 1,
    inStaging: true,
    stableSwapPoolName: StableSwapPoolName.USDC_E_USDT_E,
    poolType: PoolType.STABLE
  }),
  createMCV2Pool({
    ID: 26,
    poolId: 19,
    tokens: [SHITZU[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x5E74D85311fe2409c341Ce49Ce432BB950D221DE',
    allocPoint: 1,
    inStaging: false,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 27,
    poolId: 20,
    tokens: [WNEAR[ChainId.AURORA], ROSE[ChainId.AURORA]],
    lpAddress: '0xbe753E99D0dBd12FB39edF9b884eBF3B1B09f26C',
    rewarderAddress: '0xfe9B7A3bf38cE0CA3D5fA25d371Ff5C6598663d4',
    allocPoint: 1,
    inStaging: false,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 28,
    poolId: 21,
    tokens: [WNEAR[ChainId.AURORA], RUSD[ChainId.AURORA]],
    lpAddress: '0xbC0e71aE3Ef51ae62103E003A9Be2ffDe8421700',
    rewarderAddress: '0x87a03aFA70302a5a0F6156eBEd27f230ABF0e69C',
    allocPoint: 1,
    inStaging: false,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 29,
    poolId: 22,
    tokens: [WNEAR[ChainId.AURORA], LINEAR[ChainId.AURORA]],
    lpAddress: '0xbceA13f9125b0E3B66e979FedBCbf7A4AfBa6fd1',
    rewarderAddress: '0x1616B20534d1d1d731C31Ca325F4e909b8f3E0f0',
    allocPoint: 1,
    inStaging: false,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 30,
    poolId: 23,
    tokens: [WNEAR[ChainId.AURORA], BSTN[ChainId.AURORA]],
    lpAddress: '0xBBf3D4281F10E537d5b13CA80bE22362310b2bf9',
    rewarderAddress: '0xDc6d09f5CC085E29972d192cB3AdCDFA6495a741',
    allocPoint: 1,
    inStaging: false,
    isFeatured: true,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 31,
    poolId: 24,
    tokens: [WNEAR[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0x1e0e812FBcd3EB75D8562AD6F310Ed94D258D008',
    rewarderAddress: '0x34c58E960b80217fA3e0323d37563c762a131AD9',
    allocPoint: 1,
    inStaging: false,
    isFeatured: false,
    poolType: PoolType.TRI_ONLY
  }),
  createMCV2Pool({
    ID: 32,
    poolId: 25,
    tokens: [WNEAR[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
    rewarderAddress: '0x84C8B673ddBF0F647c350dEd488787d3102ebfa3',
    allocPoint: 1,
    inStaging: false,
    isFeatured: false,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 33,
    poolId: 26,
    tokens: [WNEAR[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
    rewarderAddress: '0x4e0152b260319e5131f853AeCB92c8f992AA0c97',
    allocPoint: 1,
    inStaging: false,
    isFeatured: false,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 34,
    poolId: 27,
    tokens: [KSW[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    lpAddress: '0x29C160d2EF4790F9A23B813e7544D99E539c28Ba',
    rewarderAddress: '0x0Cc7e9D333bDAb07b2C8d41363C72c472B7E9594',
    allocPoint: 1,
    inStaging: false,
    noTriRewards: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 35,
    poolId: 28,
    tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].poolTokens,
    lpAddress: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN].lpToken.address,
    rewarderAddress: '0x34998bb1b4721f0418B22aae5a252C3167F1e7bF',
    allocPoint: 1,
    inStaging: false,
    stableSwapPoolName: StableSwapPoolName.USDC_USDT_USN,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 36,
    poolId: 29,
    tokens: [WNEAR[ChainId.AURORA], SMARTPAD[ChainId.AURORA]],
    lpAddress: '0x6a29e635bcab8abee1491059728e3d6d11d6a114',
    rewarderAddress: '0xe4A4e38a30E9100a147e0C146a9AeAC74C28eD4f',
    allocPoint: 1,
    noTriRewards: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 37,
    poolId: 30,
    tokens: [TRI[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    lpAddress: '0x120e713AD36eCBff171FC8B7cf19FA8B6f6Ba50C',
    rewarderAddress: '0xD59c44fb39638209ec4ADD6DcD7A230a286055ee',
    allocPoint: 1,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 38,
    poolId: 31,
    tokens: [WNEAR[ChainId.AURORA], BRRR[ChainId.AURORA]],
    lpAddress: '0x71dBEB011EAC90C51b42854A77C45C1E53242698',
    rewarderAddress: '0x9a418aB67F94164EB931344A4EBF1F7bDd3E97aE',
    allocPoint: 1,
    isFeatured: true,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 39,
    poolId: 32,
    tokens: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_E_USDT_E].poolTokens,
    lpAddress: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_E_USDT_E].lpToken.address,
    rewarderAddress: '0xf4ac19e819f5940E92543B544126E7F20b5f6978',
    allocPoint: 1,
    inStaging: false,
    stableSwapPoolName: StableSwapPoolName.NUSD_USDC_E_USDT_E,
    friendlyFarmName: STABLESWAP_POOLS[StableSwapPoolName.NUSD_USDC_E_USDT_E].friendlyName,
    isFeatured: true,
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 40,
    poolId: 33,
    tokens: [WNEAR[ChainId.AURORA], USN[ChainId.AURORA]],
    lpAddress: '0xA36DF7c571bEbA7B3fB89F25dFc990EAC75F525A',
    poolType: PoolType.TRI_ONLY
  }),
  createMCV2Pool({
    ID: 41,
    poolId: 34,
    tokens: [TRI[ChainId.AURORA], REF[ChainId.AURORA]],
    lpAddress: '0x53b65177803993C84F31AF4aE7E52FEB171b3b84',
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 42,
    poolId: 35,
    tokens: [STNEAR[ChainId.AURORA], META[ChainId.AURORA]],
    lpAddress: '0x25bED9DDD30c21a698ba0654f8Da0F381CA1A67b',
    rewarderAddress: '0xE3185567D1C5dcA2483485a1A5BC42fE0740acB3',
    poolType: PoolType.LEGACY
  }),
  createMCV2Pool({
    ID: 43,
    poolId: 36,
    tokens: [WNEAR[ChainId.AURORA], PLY[ChainId.AURORA]],
    lpAddress: '0x044b6B0CD3Bb13D2b9057781Df4459C66781dCe7',
    rewarderAddress: '0xF1469a96be8C82E5D5a9B0010eDeC77BdB319448',
    isFeatured: true,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 44,
    poolId: 37,
    tokens: STABLESWAP_POOLS[StableSwapPoolName.AUUSDC_AUUSDT].poolTokens,
    lpAddress: '0x2e5F03c34A771F50C97E8f77EF801C426636e5Cd',
    rewarderAddress: '0x606201CFd3c515F2Ce7F992Af9cdD2162c16bFda',
    isFeatured: true,
    poolType: PoolType.STABLE,
    stableSwapPoolName: StableSwapPoolName.AUUSDC_AUUSDT
  }),
  createMCV2Pool({
    ID: 45,
    poolId: 38,
    tokens: [WNEAR[ChainId.AURORA], TRI[ChainId.AURORA]],
    lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
    rewarderAddress: '0x7b0C1534ba1c2945fED6f906A538a63E5EE3418D',
    isFeatured: true,
    poolType: PoolType.TRI_ONLY,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 46,
    poolId: 39,
    tokens: [WNEAR[ChainId.AURORA], NEARX[ChainId.AURORA]],
    lpAddress: '0xa904CC86e3AB79Ae44caa7F13BDC13FFAcbbFF35',
    rewarderAddress: '0xd3Faa39C97Af70ADff9851e0e70A08FcfeCaBCC4',
    isFeatured: true,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 47,
    poolId: 40,
    tokens: STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_V2].poolTokens,
    lpAddress: '0x3fADE6094373f7A91A91D4607b226791fB3BCEAf',
    isFeatured: true,
    poolType: PoolType.STABLE,
    stableSwapPoolName: StableSwapPoolName.USDC_USDT_V2,
    zapEnabled: true
  }),
  createMCV2Pool({
    ID: 48,
    poolId: 41,
    tokens: [NSTART[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x4bf2892EBd69173B9Ac98EE6899DE047583d24C6',
    rewarderAddress: '0x758E9fEF9E9F1a2fe55F14F33Bf5C6A96d84201b',
    allocPoint: 1,
    poolType: PoolType.ECOSYSTEM
  }),
  createMCV2Pool({
    ID: 49,
    poolId: 42,
    tokens: [USDC_E[ChainId.AURORA], BAT[ChainId.AURORA]],
    lpAddress: '0xb439e5B6D45f6734E9A840d5A3D6f66e45A52f8b',
    rewarderAddress: '0xEfA0D8957101052D356DaDF4fa666b4AcC74b407',
    allocPoint: 1,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 50,
    poolId: 43,
    tokens: [STAUR[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0x22E38A04c14624e6deb66762Dc98E793db2C80Cb',
    rewarderAddress: '0xB247fA13a9BE90123C4B94982A2b30c60E6182ab',
    allocPoint: 1,
    poolType: PoolType.MULTIPLE
  }),
  createMCV2Pool({
    ID: 51,
    poolId: 44,
    tokens: [USDT[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0x5A0BD6DB7979A32AD4170a194e4e2E1C10405654',
    rewarderAddress: '0x07d0488b18Aa22C8307016A79FE211F1B4471d3b',
    allocPoint: 12,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 52,
    poolId: 45,
    tokens: [USDC[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0x916827A0c7E5e8dD05c6e5191f353E26Ceeaa71d',
    rewarderAddress: '0x99364c4F4AE37a742e72bE2e02Da95ffcb5D0baA',
    allocPoint: 12,
    poolType: PoolType.DUAL_REWARDS
  }),
  createMCV2Pool({
    ID: 53,
    poolId: 46,
    tokens: [USDC[ChainId.AURORA], USDC_E[ChainId.AURORA]],
    lpAddress: '0x19e91C9b155D2A8B47B74e9e100f28355AC13879',
    rewarderAddress: '0x44aa0E85A8a1b8da723258292b588e67d40717AA',
    allocPoint: 12,
    stableSwapPoolName: StableSwapPoolName.USDC_USDC_E,
    poolType: PoolType.STABLE
  }),
  // NOTE - this is actually id 56 but evie screwed up the lp token when setting up the stableswap pool farms :(
  createMCV2Pool({
    ID: 54,
    poolId: 49,
    tokens: [USDT[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x261ed544822455101F5D2Baa66ED5C7A004A42C7',
    rewarderAddress: '0x2bE9519c860dFBeE6Fb55b3EC225976f7F7f1d09',
    allocPoint: 12,
    stableSwapPoolName: StableSwapPoolName.USDT_USDT_E,
    poolType: PoolType.STABLE
  }),
  // NOTE - you may have to replace the body if this object with the data of pool id 50 if it does not work
  // Probs only in the case for a new stable farm pool being added as pool id 50
  createMCV2Pool({
    ID: 55,
    poolId: 49,
    tokens: [USDT[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x261ed544822455101F5D2Baa66ED5C7A004A42C7',
    rewarderAddress: '0x2bE9519c860dFBeE6Fb55b3EC225976f7F7f1d09',
    allocPoint: 12,
    stableSwapPoolName: StableSwapPoolName.USDT_USDT_E,
    poolType: PoolType.STABLE
  }),
  createMCV2Pool({
    ID: 56,
    poolId: 49,
    tokens: [USDT[ChainId.AURORA], USDT_E[ChainId.AURORA]],
    lpAddress: '0x261ed544822455101F5D2Baa66ED5C7A004A42C7',
    rewarderAddress: '0x2bE9519c860dFBeE6Fb55b3EC225976f7F7f1d09',
    allocPoint: 12,
    stableSwapPoolName: StableSwapPoolName.USDT_USDT_E,
    poolType: PoolType.STABLE
  })
]
export const STAKING: {
  [chainid in ChainId]: StakingTri[]
} = {
  [ChainId.FUJI]: NULL_POOLS,
  [ChainId.AVALANCHE]: NULL_POOLS,
  [ChainId.POLYGON]: POLYGON_POOLS,
  [ChainId.AURORA]: AURORA_POOLS
}

export const ADDRESS_PRICE_MAP: { [key: string]: string } = {
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'dai',
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'usd-coin',
  '0xD6DF932A45C0f255f85145f286eA0b292B21C90B': 'aave'
}
