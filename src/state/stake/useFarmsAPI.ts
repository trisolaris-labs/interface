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
      inStaging,
      stableSwapPoolName,
      earnedNonTriRewards,
      friendlyFarmName
    } = activeFarms[index]
    const { totalStakedInUSD, totalRewardRate, apr: _apr, nonTriAPRs: _nonTriAPRs = [] } =
      stakingInfoData?.[index] ?? {}

    const apr = Math.round(_apr ?? 0)
    const nonTriAPRs = _nonTriAPRs.map(data => ({ ...data, apr: Math.round(data.apr) }))

    return {
      ID,
      poolId,
      stakingRewardAddress,
      lpAddress,
      rewarderAddress,
      tokens,
      isPeriodFinished: false,
      earnedAmount: tokenAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD ?? 0),
      allocPoint,
      totalRewardRate: Math.round(totalRewardRate ?? 0),
      rewardRate: tokenAmount,
      apr,
      chefVersion,
      inStaging,
      noTriRewards: apr === 0,
      stableSwapPoolName,
      nonTriAPRs,
      hasNonTriRewards: nonTriAPRs.some(({ apr }) => apr > 0),
      earnedNonTriRewards,
      friendlyFarmName
    }
  })

  return result.current
}
