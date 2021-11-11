import { ChainId, Token, TokenAmount } from '@trisolaris/sdk'
import { USDC, AAVE, DAI, ZERO_ADDRESS } from '../../constants'

export interface StakingTri {
  ID: number
  tokens: [Token, Token]
  stakingRewardAddress: string
  isPeriodFinished: boolean
  stakedAmount: TokenAmount
  earnedAmount: TokenAmount
  totalStakedAmount: TokenAmount
  totalStakedAmountInUSD: TokenAmount
  totalStakedAmountInETH: TokenAmount
  allocPoint: number
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  apr: number
}

const dummyToken = new Token(ChainId.POLYGON, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

const dummyAmount = new TokenAmount(dummyToken, '0')

export const TRI = new Token(ChainId.POLYGON, '0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B', 18, 'TRI', 'Trisolaris')

const POLYGON_POOLS: StakingTri[] = [
  {
    ID: 0,
    tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
    stakingRewardAddress: '0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedAmountInUSD: dummyAmount,
    totalStakedAmountInETH: dummyAmount,
    allocPoint: 1,
    totalRewardRate: dummyAmount,
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
    totalStakedAmountInUSD: dummyAmount,
    totalStakedAmountInETH: dummyAmount,
    allocPoint: 1,
    totalRewardRate: dummyAmount,
    rewardRate: dummyAmount,
    apr: 0
  },
  {
    ID: 2,
    tokens: [TRI, USDC[ChainId.POLYGON]],
    stakingRewardAddress: '0xb0c5eFFD0eA4D4d274971374d696Fa08860Ea709',
    isPeriodFinished: false,
    stakedAmount: dummyAmount,
    earnedAmount: dummyAmount,
    totalStakedAmount: dummyAmount,
    totalStakedAmountInUSD: dummyAmount,
    totalStakedAmountInETH: dummyAmount,
    allocPoint: 1,
    totalRewardRate: dummyAmount,
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
    totalStakedAmountInUSD: dummyAmount,
    totalStakedAmountInETH: dummyAmount,
    allocPoint: 0,
    totalRewardRate: dummyAmount,
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
  [ChainId.AURORA]: NULL_POOLS
}

export const ADDRESS_PRICE_MAP: { [key: string]: string } = {
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': 'dai',
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'usd-coin',
  '0xD6DF932A45C0f255f85145f286eA0b292B21C90B': 'aave'
}
