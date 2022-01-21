import { ChefVersions } from '../../../state/stake/stake-constants'
import { Token, TokenAmount } from '@trisolaris/sdk'

export type LpTokenProps = {
  lpAddress: string
  token0: Token
  token1: Token
}

type Farm = {
  farmId: number
  userLPStakedAmount: TokenAmount | null
  totalStakedInPool: TokenAmount
  totalPoolAmountUSD: number
  chefVersion: ChefVersions
  lpToken: Token
}

export type DummyCompProps = {
  farm: Farm
  updateAmounts: (
    id: number,
    stakedAmount: number,
    rewards: number,
    parsedNewDoubleRewardsAmount: number,
    doubleRewardsToken: string
  ) => void
}

export type FarmAmount = {
  [id: number]: {
    totalStaked: number
    tokens: {
      [id: string]: number
    }
  }
}
