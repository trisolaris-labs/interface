import { Token, ChainId, TokenAmount } from '@trisolaris/sdk'
import _ from 'lodash'
import { ZERO_ADDRESS } from '../../../constants'
import { MASTERCHEF_ADDRESS_V1, MASTERCHEF_ADDRESS_V2 } from '../hooks-sushi'
import { StakingTri, ChefVersions } from '../stake-constants'

type TCreateMCPool = Omit<Partial<StakingTri>, 'stakingRewardAddress' | 'chefVersion'>

const dummyToken = new Token(ChainId.AURORA, ZERO_ADDRESS, 18, 'ZERO', 'ZERO')

const dummyAmount = new TokenAmount(dummyToken, '0')

export const NULL_POOL: StakingTri = {
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
  isFeatured: false
}
export const NULL_POOLS = [NULL_POOL]

/**
 * Creates a pool
 * Only set properties that are different than the `NULL_POOL`
 * @param poolData
 * @returns StakingTri
 */
function createPool(...poolData: Partial<StakingTri>[]): StakingTri {
  return _.defaultsDeep({}, ...poolData, NULL_POOL)
}

/**
 * Creates a MasterChefV1 pool
 * Only set properties that are different than the `NULL_POOL`
 * @param poolData
 * @returns StakingTri
 */
export function createMCV1Pool(poolData: TCreateMCPool): StakingTri {
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
export function createMCV2Pool(poolData: TCreateMCPool): StakingTri {
  const masterchefV2Props = {
    stakingRewardAddress: MASTERCHEF_ADDRESS_V2[ChainId.AURORA],
    chefVersion: ChefVersions.V2
  }
  return createPool(poolData, masterchefV2Props, NULL_POOL)
}
