import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import { USDC, AAVE, DAI, ZERO_ADDRESS, WNEAR, USDT, WBTC, TRI, AURORA } from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS_V1,MASTERCHEF_ADDRESS_V2 } from './hooks-sushi'

export enum ChefVersions{
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

const dummyToken = new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

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
    apr2:0,
    chefVersion: ChefVersions.V1
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
    apr2:0,
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V1
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
    chefVersion: ChefVersions.V2
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
    chefVersion: ChefVersions.V2
  },
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
    chefVersion: ChefVersions.V1
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
