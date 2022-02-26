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
  LUNA,
  UST,
  BNB,
  AVAX,
  MATIC,
  FLX,
  MECHA,
  SOLACE,
  STNEAR,
  XTRI,
  META,
  XNL,
  GBA
} from '../../constants/tokens'
import { MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from './hooks-sushi'

export enum ChefVersions {
  V1,
  V2
}

export type StakingTri = StakingTriStakedAmounts & StakingTriFarms

export type StakingTriStakedAmounts = {
  ID: number
  stakedAmount: TokenAmount | null
}
export type StakingTriFarms = {
  ID: number
  poolId: number
  tokens: [Token, Token]
  stakingRewardAddress: string
  lpAddress: string
  rewarderAddress: string
  isPeriodFinished: boolean
  earnedAmount: TokenAmount
  doubleRewardAmount: TokenAmount
  totalStakedAmount: TokenAmount
  totalStakedInUSD: number
  allocPoint: number
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: number
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  apr: number
  apr2: number
  chefVersion: ChefVersions
  doubleRewards: boolean
  inStaging: boolean
  noTriRewards: boolean
  doubleRewardToken: Token
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
  apr2: number
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
  doubleRewardAmount: dummyAmount,
  totalStakedAmount: dummyAmount,
  totalStakedInUSD: 0,
  allocPoint: 0,
  totalRewardRate: 1,
  rewardRate: dummyAmount,
  apr: 0,
  apr2: 0,
  chefVersion: ChefVersions.V1,
  doubleRewards: false,
  inStaging: false,
  noTriRewards: false,
  doubleRewardToken: dummyToken
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
    tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
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
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 1,
    poolId: 1,
    tokens: [WNEAR[ChainId.AURORA], USDC[ChainId.AURORA]],
    lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 2,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], USDT[ChainId.AURORA]],
    lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 3,
    poolId: 3,
    tokens: [USDT[ChainId.AURORA], USDC[ChainId.AURORA]],
    lpAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 4,
    poolId: 4,
    tokens: [WNEAR[ChainId.AURORA], WBTC[ChainId.AURORA]],
    lpAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 5,
    poolId: 5,
    tokens: [TRI[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
    allocPoint: 1
  }),
  createMCV1Pool({
    ID: 6,
    poolId: 6,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    allocPoint: 1
  }),
  createMCV2Pool({
    ID: 7,
    poolId: 0,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    rewarderAddress: '0x94669d7a170bfe62FAc297061663e0B48C63B9B5',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: AURORA[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 8,
    poolId: 1,
    tokens: [TRI[ChainId.AURORA], AURORA[ChainId.AURORA]],
    lpAddress: '0xd1654a7713617d41A8C9530Fb9B948d00e162194',
    rewarderAddress: '0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: AURORA[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 9,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], LUNA[ChainId.AURORA]],
    lpAddress: '0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914',
    rewarderAddress: '0x89F6628927fdFA2592E016Ba5B14389a4b08D681',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: LUNA[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 10,
    poolId: 3,
    tokens: [WNEAR[ChainId.AURORA], UST[ChainId.AURORA]],
    lpAddress: '0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90',
    rewarderAddress: '0x17d1597ec86fD6aecbfE0F32Ab2F2aD9c37E6750',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: LUNA[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 11,
    poolId: 4,
    tokens: [TRI[ChainId.AURORA], USDT[ChainId.AURORA]],
    lpAddress: '0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c',
    allocPoint: 1
  }),
  createMCV2Pool({
    ID: 12,
    poolId: 5,
    tokens: [WNEAR[ChainId.AURORA], AVAX[ChainId.AURORA]],
    lpAddress: '0x6443532841a5279cb04420E61Cf855cBEb70dc8C',
    allocPoint: 1
  }),
  createMCV2Pool({
    ID: 13,
    poolId: 6,
    tokens: [WNEAR[ChainId.AURORA], BNB[ChainId.AURORA]],
    lpAddress: '0x7be4a49AA41B34db70e539d4Ae43c7fBDf839DfA',
    allocPoint: 1
  }),
  createMCV2Pool({
    ID: 14,
    poolId: 7,
    tokens: [WNEAR[ChainId.AURORA], MATIC[ChainId.AURORA]],
    lpAddress: '0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071',
    allocPoint: 1
  }),
  createMCV2Pool({
    ID: 15,
    poolId: 8,
    tokens: [WNEAR[ChainId.AURORA], FLX[ChainId.AURORA]],
    lpAddress: '0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09',
    rewarderAddress: '0x42b950FB4dd822ef04C4388450726EFbF1C3CF63',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: FLX[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 16,
    poolId: 9,
    tokens: [WNEAR[ChainId.AURORA], MECHA[ChainId.AURORA]],
    lpAddress: '0xd62f9ec4C4d323A0C111d5e78b77eA33A2AA862f',
    rewarderAddress: '0x9847F7e33CCbC0542b05d15c5cf3aE2Ae092C057',
    allocPoint: 1,
    noTriRewards: true,
    doubleRewardToken: MECHA[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 17,
    poolId: 10,
    tokens: [WNEAR[ChainId.AURORA], SOLACE[ChainId.AURORA]],
    lpAddress: '0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2',
    rewarderAddress: '0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30',
    allocPoint: 1,
    noTriRewards: true,
    doubleRewardToken: SOLACE[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 18,
    poolId: 11,
    tokens: [XTRI[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    lpAddress: '0x5913f644A10d98c79F2e0b609988640187256373',
    rewarderAddress: '0x7B9e31BbEdbfdc99e3CC8b879b9a3B1e379Ce530',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: META[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 19,
    poolId: 12,
    tokens: [WNEAR[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    lpAddress: '0x47924Ae4968832984F4091EEC537dfF5c38948a4',
    rewarderAddress: '0xf267212F1D8888e0eD20BbB0c7C87A089cDe6E88',
    allocPoint: 1,
    doubleRewards: true,
    doubleRewardToken: META[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 20,
    poolId: 13,
    tokens: [AURORA[ChainId.AURORA], XNL[ChainId.AURORA]],
    lpAddress: '0xb419ff9221039Bdca7bb92A131DD9CF7DEb9b8e5',
    rewarderAddress: '0xb84293D04137c9061afe34118Dac9931df153826',
    allocPoint: 1,
    noTriRewards: true,
    doubleRewardToken: XNL[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 21,
    poolId: 14,
    tokens: [WNEAR[ChainId.AURORA], XNL[ChainId.AURORA]],
    lpAddress: '0xFBc4C42159A5575a772BebA7E3BF91DB508E127a',
    rewarderAddress: '0x028Fbc4BB5787e340524EF41d95875Ac2C382101',
    allocPoint: 1,
    noTriRewards: true,
    doubleRewardToken: XNL[ChainId.AURORA]
  }),
  createMCV2Pool({
    ID: 22,
    poolId: 15,
    tokens: [USDT[ChainId.AURORA], GBA[ChainId.AURORA]],
    lpAddress: '0x7B273238C6DD0453C160f305df35c350a123E505',
    rewarderAddress: '0xDAc58A615E2A1a94D7fb726a96C273c057997D50',
    allocPoint: 1,
    noTriRewards: true,
    doubleRewardToken: GBA[ChainId.AURORA]
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
