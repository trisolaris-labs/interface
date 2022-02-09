import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import {
  USDC,
  AAVE,
  DAI,
  ZERO_ADDRESS,
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
  META
} from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from './hooks-sushi'

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

export const rewardsPerSecond = JSBI.BigInt('10000000000000000000')
export const totalAllocPoints = JSBI.BigInt('5')
export const tokenAmount = new TokenAmount(dummyToken, '99')

const POLYGON_POOLS: StakingTri[] = [
  {
    ID: 0,
    poolId: 0,
    tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.POLYGON],
    lpAddress: '0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 1,
    poolId: 1,
    tokens: [AAVE[ChainId.POLYGON], DAI[ChainId.POLYGON]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.POLYGON],
    lpAddress: '0x76F4128B11f429289499BA29518Ef7E5b26025B6',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
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
]

const AURORA_POOLS: StakingTri[] = [
  {
    ID: 0,
    poolId: 0,
    tokens: [WETH[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 1,
    poolId: 1,
    tokens: [WNEAR[ChainId.AURORA], USDC[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 2,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], USDT[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 3,
    poolId: 3,
    tokens: [USDT[ChainId.AURORA], USDC[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 4,
    poolId: 4,
    tokens: [WNEAR[ChainId.AURORA], WBTC[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 5,
    poolId: 5,
    tokens: [TRI[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 6,
    poolId: 6,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V1[ChainId.AURORA],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V1,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 7,
    poolId: 0,
    tokens: [AURORA[ChainId.AURORA], WETH[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x5eeC60F348cB1D661E4A5122CF4638c7DB7A886e',
    rewarderAddress: '0x94669d7a170bfe62FAc297061663e0B48C63B9B5',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: AURORA[ChainId.AURORA]
  },
  {
    ID: 8,
    poolId: 1,
    tokens: [TRI[ChainId.AURORA], AURORA[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0xd1654a7713617d41A8C9530Fb9B948d00e162194',
    rewarderAddress: '0x78EdEeFdF8c3ad827228d07018578E89Cf159Df1',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: AURORA[ChainId.AURORA]
  },
  {
    ID: 9,
    poolId: 2,
    tokens: [WNEAR[ChainId.AURORA], LUNA[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0xdF8CbF89ad9b7dAFdd3e37acEc539eEcC8c47914',
    rewarderAddress: '0x89F6628927fdFA2592E016Ba5B14389a4b08D681',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: LUNA[ChainId.AURORA]
  },
  {
    ID: 10,
    poolId: 3,
    tokens: [WNEAR[ChainId.AURORA], UST[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0xa9eded3E339b9cd92bB6DEF5c5379d678131fF90',
    rewarderAddress: '0x17d1597ec86fD6aecbfE0F32Ab2F2aD9c37E6750',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: LUNA[ChainId.AURORA]
  },
  {
    ID: 11,
    poolId: 4,
    tokens: [TRI[ChainId.AURORA], USDT[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x61C9E05d1Cdb1b70856c7a2c53fA9c220830633c',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 12,
    poolId: 5,
    tokens: [WNEAR[ChainId.AURORA], AVAX[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x6443532841a5279cb04420E61Cf855cBEb70dc8C',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 13,
    poolId: 6,
    tokens: [WNEAR[ChainId.AURORA], BNB[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x7be4a49AA41B34db70e539d4Ae43c7fBDf839DfA',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 14,
    poolId: 7,
    tokens: [WNEAR[ChainId.AURORA], MATIC[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x3dC236Ea01459F57EFc737A12BA3Bb5F3BFfD071',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: dummyToken
  },
  {
    ID: 15,
    poolId: 8,
    tokens: [WNEAR[ChainId.AURORA], FLX[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x48887cEEA1b8AD328d5254BeF774Be91B90FaA09',
    rewarderAddress: '0x42b950FB4dd822ef04C4388450726EFbF1C3CF63',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: false,
    noTriRewards: false,
    doubleRewardToken: FLX[ChainId.AURORA]
  },
  {
    ID: 16,
    poolId: 9,
    tokens: [WNEAR[ChainId.AURORA], MECHA[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0xd62f9ec4C4d323A0C111d5e78b77eA33A2AA862f',
    rewarderAddress: '0x9847F7e33CCbC0542b05d15c5cf3aE2Ae092C057',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: true,
    doubleRewardToken: MECHA[ChainId.AURORA]
  },
  {
    ID: 17,
    poolId: 10,
    tokens: [WNEAR[ChainId.AURORA], SOLACE[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0xdDAdf88b007B95fEb42DDbd110034C9a8e9746F2',
    rewarderAddress: '0xbbE41F699B0fB747cd4bA21067F6b27e0698Bc30',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: false,
    inStaging: false,
    noTriRewards: true,
    doubleRewardToken: SOLACE[ChainId.AURORA]
  },
  {
    ID: 18,
    poolId: 11,
    tokens: [XTRI[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x5913f644A10d98c79F2e0b609988640187256373',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: true,
    noTriRewards: false,
    doubleRewardToken: META[ChainId.AURORA]
  },
  {
    ID: 19,
    poolId: 12,
    tokens: [WNEAR[ChainId.AURORA], STNEAR[ChainId.AURORA]],
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    lpAddress: '0x47924Ae4968832984F4091EEC537dfF5c38948a4',
    rewarderAddress: '',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    doubleRewardAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0,
    apr2: 0,
    chefVersion: ChefVersions.V2,
    doubleRewards: true,
    inStaging: true,
    noTriRewards: false,
    doubleRewardToken: META[ChainId.AURORA]
  }
]

const NULL_POOLS: StakingTri[] = [
  {
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
