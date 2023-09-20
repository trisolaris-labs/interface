import { ChainId } from '@trisolaris/sdk'
import { STAKING, StakingTriFarms, tokenAmount } from './stake-constants'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import React, { useRef } from 'react'

import { roundDecimal } from '../../utils'
import { NETWORK_CHAIN_ID } from '../../connectors'

// gets the staking info from the network for the active chain id
export function useFarmsAPI(): StakingTriFarms[] {
  const chainId = NETWORK_CHAIN_ID
  const activeFarms = STAKING[ChainId.AURORA]
  const lpAddresses = activeFarms.map(key => key.lpAddress)

  const result = useRef<StakingTriFarms[]>(activeFarms)
  const stakingInfoData = useFetchStakingInfoData()

  // get all the info from the staking rewards contracts

  if (!chainId) {
    return activeFarms
  }

  result.current = lpAddresses.map((_, index) => {
    const { totalStakedInUSD, totalRewardRate, apr: _apr, nonTriAPRs: _nonTriAPRs = [] } =
      stakingInfoData?.[index] ?? {}

    const apr = roundDecimal(_apr ?? 0)
    const nonTriAPRs = _nonTriAPRs.filter(({ apr }) => apr > 0).map(data => ({ ...data, apr: roundDecimal(data.apr) }))

    return {
      ...activeFarms[index],
      earnedAmount: tokenAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD ?? 0),
      totalRewardRate: Math.round(totalRewardRate ?? 0),
      rewardRate: tokenAmount,
      apr,
      noTriRewards: apr === 0,
      nonTriAPRs,
      hasNonTriRewards: nonTriAPRs.some(({ apr }) => apr > 0)
    }
  })

  return result.current
}
