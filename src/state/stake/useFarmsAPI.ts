import { ChainId } from '@trisolaris/sdk'
import { STAKING, StakingTriFarms, tokenAmount } from './stake-constants'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import React, { useRef } from 'react'

// gets the staking info from the network for the active chain id
export function useFarmsAPI(): StakingTriFarms[] {
  const { chainId } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  let lpAddresses = activeFarms.map(key => key.lpAddress)

  const result = useRef<StakingTriFarms[]>(activeFarms)
  const stakingInfoData = useFetchStakingInfoData()

  // get all the info from the staking rewards contracts

  if (!chainId) {
    return activeFarms
  }

  result.current = lpAddresses.map((_, index) => {
    const { chefVersion, tokens } = activeFarms[index]
    const { totalStakedInUSD, totalRewardRate, apr, apr2 } = stakingInfoData?.[index] ?? {}

    return {
      ID: activeFarms[index].ID,
      poolId: activeFarms[index].poolId,
      stakingRewardAddress: activeFarms[index].stakingRewardAddress,
      lpAddress: activeFarms[index].lpAddress,
      rewarderAddress: activeFarms[index].rewarderAddress,
      tokens: tokens,
      isPeriodFinished: false,
      earnedAmount: tokenAmount,
      doubleRewardAmount: tokenAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD ?? 0),
      allocPoint: activeFarms[index].allocPoint,
      totalRewardRate: Math.round(totalRewardRate ?? 0),
      rewardRate: tokenAmount,
      apr: Math.round(apr ?? 0),
      apr2: Math.round(apr2 ?? 0),
      chefVersion: chefVersion,
      doubleRewards: activeFarms[index].doubleRewards,
      inStaging: activeFarms[index].inStaging,
      doubleRewardToken: activeFarms[index].doubleRewardToken
    }
  })

  return result.current
}
