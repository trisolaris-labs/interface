import { ChainId } from '@trisolaris/sdk'
import { STAKING, StakingTriFarms, tokenAmount } from './stake-constants'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import React, { useRef } from 'react'

// gets the staking info from the network for the active chain id
export function useFarmsAPI(): StakingTriFarms[] {
  const { chainId } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const lpAddresses = activeFarms.map(key => key.lpAddress)

  const result = useRef<StakingTriFarms[]>(activeFarms)
  const stakingInfoData = useFetchStakingInfoData()

  // get all the info from the staking rewards contracts

  if (!chainId) {
    return activeFarms
  }

  result.current = lpAddresses.map((_, index) => {
    const {
      chefVersion,
      tokens,
      ID,
      poolId,
      stakingRewardAddress,
      lpAddress,
      rewarderAddress,
      allocPoint,
      doubleRewards,
      inStaging,
      noTriRewards,
      doubleRewardToken,
      stableSwapPoolName
    } = activeFarms[index]
    const { totalStakedInUSD, totalRewardRate, apr, apr2, nonTriAPRs } = stakingInfoData?.[index] ?? {}

    return {
      ID,
      poolId,
      stakingRewardAddress,
      lpAddress,
      rewarderAddress,
      tokens,
      isPeriodFinished: false,
      earnedAmount: tokenAmount,
      doubleRewardAmount: tokenAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD ?? 0),
      allocPoint,
      totalRewardRate: Math.round(totalRewardRate ?? 0),
      rewardRate: tokenAmount,
      apr: Math.round(apr ?? 0),
      apr2: Math.round(apr2 ?? 0),
      chefVersion,
      doubleRewards,
      inStaging,
      noTriRewards,
      doubleRewardToken,
      stableSwapPoolName,
      nonTriAPRs
    }
  })

  return result.current
}
