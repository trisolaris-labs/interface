import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { TRI, AURORA } from '../../constants'
import { useComplexRewarderContract, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { STAKING, StakingTri, tokenAmount, ChefVersions } from './stake-constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useMemo } from 'react'
import { useBlockNumber } from '../application/hooks'

// gets the staking info from the network for the active chain id
export function useMultipleUserFarms(farmsVersions: number[]): null {
  const farmsReady = farmsVersions.length
  const { chainId, account } = useActiveWeb3React()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]

  //   const { chefVersion, poolId, rewarderAddress } = activeFarms.filter(farm => farmsVersions.includes(farm.ID))
  const filteredFarms = activeFarms
    .filter(farm => farmsVersions.includes(farm.ID))
    .map(farm => ({
      chefVersion: farm.chefVersion,
      poolId: farm.poolId,
      rewarderAddress: farm.rewarderAddress,
      v1args: [farm.poolId.toString(), account?.toString()]
    }))

  //   const v1args = [poolId.toString(), account?.toString()]
  //   const v2args = [poolId.toString(), account?.toString(), '0']

  const contract = useMasterChefV2ContractForVersion(1)

  const pendingTri = useSingleCallResult(
    farmsReady ? contract : null,
    'pendingTri',
    farmsReady ? filteredFarms[0].v1args : []
  )
  console.log(pendingTri)
  //   const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)
  //   const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
  return null
}
