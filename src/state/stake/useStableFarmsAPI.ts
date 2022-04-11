import React, { useRef } from 'react'
import { ChainId } from '@trisolaris/sdk'

import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'

import { STABLE_FARMS, StableFarm } from '../stableswap/constants'
import { NULL_POOL, tokenAmount } from './stake-constants'

import { MOCK_DATA } from './MOCK_STABLEFARM_DATA'

// gets the staking info from the network for the active chain id
export function useStableFarmsAPI(): StableFarm[] {
  const { chainId } = useActiveWeb3React()

  const activeFarms = Object.values(STABLE_FARMS[ChainId.AURORA])

  const result = useRef<StableFarm[]>(activeFarms)
  const stakingInfoData = useFetchStakingInfoData()

  // get all the info from the staking rewards contracts

  if (!chainId) {
    return activeFarms
  }

  result.current = activeFarms.map((farm, index) => {
    const { poolId } = farm

    // const stableFarmStakingInfo = stakingInfoData?.find(stakingPool => stakingPool.poolId === poolId)
    // TODO: Replace by real data
    const stableFarmStakingInfo = MOCK_DATA

    const { totalStakedInUSD, totalRewardRate, apr, apr2 } = stableFarmStakingInfo ?? {}

    return {
      ...NULL_POOL,
      ID: farm.ID,
      poolId: poolId,
      stakingRewardAddress: farm.stakingRewardAddress,
      lpAddress: farm.lpAddress,
      rewarderAddress: farm.rewarderAddress,
      tokens: farm.tokens,
      isPeriodFinished: false,
      earnedAmount: tokenAmount,
      doubleRewardAmount: tokenAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD ?? 0),
      allocPoint: farm.allocPoint,
      totalRewardRate: Math.round(totalRewardRate ?? 0),
      rewardRate: tokenAmount,
      apr: Math.round(apr ?? 0),
      apr2: Math.round(apr2 ?? 0),
      chefVersion: farm.chefVersion,
      doubleRewards: farm.doubleRewards,
      inStaging: farm.inStaging,
      noTriRewards: farm.noTriRewards,
      doubleRewardToken: farm.doubleRewardToken,
      isStableSwap: true,
      name: farm.name,
      lpToken: farm.lpToken
    }
  })

  return result.current
}
