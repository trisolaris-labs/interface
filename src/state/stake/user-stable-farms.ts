import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { TRI } from '../../constants/tokens'
import { useComplexRewarderContract, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { STAKING, StakingTri, tokenAmount, ChefVersions } from './stake-constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useMemo } from 'react'
import { useBlockNumber } from '../application/hooks'
import { StableSwapPoolName } from '../stableswap/constants'
import useStablePoolsData from '../../hooks/useStablePoolsData'

// gets the staking info from the network for the active chain id
export function useSingleStableFarm(version: number, stableSwapPoolName: StableSwapPoolName): StakingTri {
  const { chainId, account } = useActiveWeb3React()
  const latestBlock = useBlockNumber()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const { chefVersion, poolId, rewarderAddress } = activeFarms[version]

  const stakingInfoData = useFetchStakingInfoData()
  const complexRewarderContract = useComplexRewarderContract(rewarderAddress)

  const v1args = [poolId.toString(), account?.toString()]
  const v2args = [poolId.toString(), account?.toString(), '0']

  const contract = useMasterChefV2ContractForVersion(chefVersion)

  const pendingTri = useSingleCallResult(contract, 'pendingTri', v1args) //user related
  const userInfo = useSingleCallResult(contract, 'userInfo', v1args) //user related
  const pendingComplexRewards = useSingleCallResult(
    chefVersion === ChefVersions.V2 ? complexRewarderContract : null,
    'pendingTokens',
    v2args
  )
  // get all the info from the staking rewards contracts
  const [stablePoolData] = useStablePoolsData(stableSwapPoolName)

  const result = useMemo(() => {
    // Loading
    if (chainId == null || userInfo?.loading || pendingTri?.loading || pendingComplexRewards?.loading) {
      return activeFarms[version]
    }

    // Error
    if (
      stablePoolData == null ||
      stablePoolData?.lpToken == null ||
      userInfo.error ||
      pendingComplexRewards.error ||
      pendingTri.error ||
      stakingInfoData?.[version] == null
    ) {
      console.error('Failed to load staking rewards info')
      return activeFarms[version]
    }
    const userInfoPool = JSBI.BigInt(userInfo.result?.['amount'] ?? 0)
    const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)
    const earnedComplexRewardPool = JSBI.BigInt(pendingComplexRewards.result?.rewardAmounts?.[0] ?? 0)

    const stakedAmount = new TokenAmount(stablePoolData.lpToken, JSBI.BigInt(userInfoPool))
    const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
    const earnedComplexAmount = new TokenAmount(
      activeFarms[version].doubleRewardToken,
      JSBI.BigInt(earnedComplexRewardPool)
    )

    const { totalStakedInUSD, totalRewardRate, apr, apr2 } = stakingInfoData[version]

    return {
      ...activeFarms[version],
      isPeriodFinished: false,
      earnedAmount: earnedAmount,
      doubleRewardAmount: earnedComplexAmount,
      stakedAmount,
      totalStakedAmount: tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD),
      totalRewardRate: Math.round(totalRewardRate),
      rewardRate: tokenAmount,
      apr: Math.round(apr),
      apr2: Math.round(apr2),
      chefVersion
    }
  }, [
    chainId,
    userInfo?.loading,
    userInfo.error,
    userInfo.result,
    pendingTri?.loading,
    pendingTri.error,
    pendingTri.result,
    pendingComplexRewards?.loading,
    pendingComplexRewards.error,
    pendingComplexRewards.result?.rewardAmounts,
    stablePoolData,
    stakingInfoData,
    version,
    activeFarms,
    chefVersion
  ])

  return result
}
