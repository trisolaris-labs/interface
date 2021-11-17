import { ChainId, Token, TokenAmount, WETH, JSBI } from '@trisolaris/sdk'
import { USDC, AAVE, DAI, ZERO_ADDRESS, WNEAR, USDT, WBTC ,TRI } from '../../constants'

export interface StakingTri {
  ID: number
  tokens: [Token, Token]
  stakingRewardAddress: string
  isPeriodFinished: boolean
  stakedAmount: TokenAmount
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
}


async function fetchAprData() {
  let response = await fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

export let aprData = Promise.resolve(fetchAprData()).then(value => {
  aprData = value
})

const dummyToken = new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

const dummyAmount = new TokenAmount(dummyToken, '0')

export const rewardsPerSecond = JSBI.BigInt("10000000000000000000")
export const totalAllocPoints = JSBI.BigInt("5")
export const tokenAmount = new TokenAmount(dummyToken, '99')

const POLYGON_POOLS: StakingTri[] = [
  {
    ID: 0,
    tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
    stakingRewardAddress: '0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 1,
    tokens: [AAVE[ChainId.POLYGON], DAI[ChainId.POLYGON]],
    stakingRewardAddress: '0x76F4128B11f429289499BA29518Ef7E5b26025B6',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
]

const AURORA_POOLS: StakingTri[] = [
  {
    ID: 0,
    tokens: [WETH[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    stakingRewardAddress: '0x63da4DB6Ef4e7C62168aB03982399F9588fCd198',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 1,
    tokens: [WNEAR[ChainId.AURORA], USDC[ChainId.AURORA]],
    stakingRewardAddress: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 2,
    tokens: [WNEAR[ChainId.AURORA], USDT[ChainId.AURORA]],
    stakingRewardAddress: '0x03B666f3488a7992b2385B12dF7f35156d7b29cD',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 3,
    tokens: [USDT[ChainId.AURORA], USDC[ChainId.AURORA]],
    stakingRewardAddress: '0x2fe064B6c7D274082aa5d2624709bC9AE7D16C77',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 4,
    tokens: [WNEAR[ChainId.AURORA], WBTC[ChainId.AURORA]],
    stakingRewardAddress: '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 5,
    tokens: [TRI[ChainId.AURORA], WNEAR[ChainId.AURORA]],
    stakingRewardAddress: '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 1,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
  }
]

const NULL_POOLS: StakingTri[] = [
  {
    ID: 0,
    tokens: [
      new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO'),
      new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')
    ],
    stakingRewardAddress: ZERO_ADDRESS,
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedInUSD: 0,
    allocPoint: 0,
    totalRewardRate: 1,
    rewardRate: dummyAmount,
    apr: 0
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
