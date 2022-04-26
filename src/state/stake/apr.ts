import { ChefVersions, STAKING, StakingTri } from './stake-constants'
import { useMemo } from 'react'
import { useFarmsAPI } from './useFarmsAPI'
import { useActiveWeb3React } from '../../hooks'
import { ChainId } from '@trisolaris/sdk'
import { useFarmContractsForVersion } from './useFarmContractsForVersion'
import { useFarmContractsForStableSwap } from './useFarmContractsForStableSwap'

// gets the staking info from the network for the active chain id
export function useFarms(): StakingTri[] {
  const { chainId } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const farms = useFarmsAPI()
  const stakingInfoV1 = useFarmContractsForVersion(ChefVersions.V1)
  const stakingInfoV2 = useFarmContractsForVersion(ChefVersions.V2)
  const stableSwapStakingInfo = useFarmContractsForStableSwap()

  const stakingInfo = stakingInfoV1.concat(stakingInfoV2, stableSwapStakingInfo)

  const stakingInfoMap = useMemo(
    () =>
      stakingInfo.reduce((acc, item) => {
        acc.set(item.ID, item)
        return acc
      }, new Map()),
    [stakingInfo]
  )

  const farmsMap = useMemo(
    () =>
      farms.reduce((acc, item) => {
        acc.set(item.ID, item)
        return acc
      }, new Map()),
    [farms]
  )

  const result = useMemo(
    () =>
      activeFarms.reduce<StakingTri[]>((acc, farm) => {
        const farmID = farm.ID
        const farmResult = farmsMap.has(farmID) ? farmsMap.get(farmID) : farm

        if (stakingInfoMap.has(farmID)) {
          const { stakedAmount } = stakingInfoMap.get(farmID)
          farmResult.stakedAmount = stakedAmount
        }

        acc.push(farmResult)

        return acc
      }, []),
    [activeFarms, farmsMap, stakingInfoMap]
  )

  return result
}
