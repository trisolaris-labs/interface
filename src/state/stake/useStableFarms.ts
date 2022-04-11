import { useMemo } from 'react'
import { ChainId } from '@trisolaris/sdk'

import { useActiveWeb3React } from '../../hooks'
import { useStableFarmsAPI } from './useStableFarmsAPI'
import { useStableFarmContractsForVersion } from './useStableFarmContractsForVersions'

import { StableFarm, STABLE_FARMS } from '../stableswap/constants'
import { ChefVersions, STAKING } from './stake-constants'

// gets the staking info from the network for the active chain id
export function useStableFarms(): StableFarm[] {
  const { chainId } = useActiveWeb3React()

  const activeFarms = Object.values(STABLE_FARMS[ChainId.AURORA])
  const farms = useStableFarmsAPI()

  //   const stakingInfoV1 = useFarmContractsForVersion(ChefVersions.V1)
  const stakingInfoV2 = useStableFarmContractsForVersion(ChefVersions.V2)
  //   const stakingInfo = stakingInfoV1.concat(stakingInfoV2)
  const stakingInfo = stakingInfoV2

  const stakingInfoMap = useMemo(
    () =>
      stakingInfo.reduce((acc, item) => {
        acc.set(item.name, item)
        return acc
      }, new Map()),
    [stakingInfo]
  )

  const farmsMap = useMemo(
    () =>
      farms.reduce((acc, item) => {
        acc.set(item.name, item)
        return acc
      }, new Map()),
    [farms]
  )

  const result = useMemo(
    () =>
      activeFarms.reduce<StableFarm[]>((acc, farm) => {
        const farmID = farm.name
        const farmResult = farmsMap.has(farmID) ? farmsMap.get(farmID) : farm

        if (stakingInfoMap.has(farmID)) {
          const { stakedAmount } = stakingInfoMap.get(farmID)
          farmResult.stakedAmount = stakedAmount
        }

        acc.push(farmResult)

        return acc
      }, []),
    [stakingInfoMap, farms]
  )

  return result
}
