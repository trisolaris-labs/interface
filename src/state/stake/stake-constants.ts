import { ChainId, Token, TokenAmount } from "@trisolaris/sdk";
import {
    USDC,
    AAVE,
    DAI,
    ZERO_ADDRESS
  } from '../../constants'

export interface StakingTri {
    ID: number
    tokens: [Token, Token]
    stakingRewardAddress: string
    isPeriodFinished: boolean
    stakedAmount: TokenAmount | undefined,
    earnedAmount: TokenAmount | undefined,
    totalStakedAmount: TokenAmount | undefined,
    totalStakedAmountInUSD: TokenAmount | undefined,
    totalStakedAmountInETH: TokenAmount | undefined,
    apr: number,
  }

const POLYGON_POOLS: StakingTri[] = [
    {
        ID: 0,
        tokens: [DAI[ChainId.POLYGON], USDC[ChainId.POLYGON]],
        stakingRewardAddress: "0xd6f922f6eB4dfa47f53C038c7dE9bE614a49257f",
        isPeriodFinished: false,
        stakedAmount: undefined,
        earnedAmount: undefined,
        totalStakedAmount: undefined,
        totalStakedAmountInUSD: undefined,
        totalStakedAmountInETH: undefined,
        apr: 10,
    },
    {
        ID: 1,
        tokens: [AAVE[ChainId.POLYGON], DAI[ChainId.POLYGON]],
        stakingRewardAddress: "0x76F4128B11f429289499BA29518Ef7E5b26025B6",
        isPeriodFinished: false,
        stakedAmount: undefined,
        earnedAmount: undefined,
        totalStakedAmount: undefined,
        totalStakedAmountInUSD: undefined,
        totalStakedAmountInETH: undefined,
        apr: 10,
    },
]

const NULL_POOLS: StakingTri[] = [
    {
        ID: 0,
        tokens: [
            new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO'),
            new Token(ChainId.FUJI, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')],
        stakingRewardAddress: ZERO_ADDRESS,
        isPeriodFinished: false,
        stakedAmount: undefined,
        earnedAmount: undefined,
        totalStakedAmount: undefined,
        totalStakedAmountInUSD: undefined,
        totalStakedAmountInETH: undefined,
        apr: 0,
    }
]

export const STAKING: {
    [chainid in ChainId] : StakingTri[]
  } = {
    
    [ChainId.FUJI]: NULL_POOLS,
    [ChainId.AVALANCHE]: NULL_POOLS,
    [ChainId.POLYGON]: POLYGON_POOLS,
    [ChainId.AURORA]: NULL_POOLS,
  }