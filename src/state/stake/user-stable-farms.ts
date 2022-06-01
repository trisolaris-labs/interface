import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { TRI } from '../../constants/tokens'
import { useMasterChefV2ContractForVersion } from './hooks-sushi'
import { STAKING, StakingTri, tokenAmount } from './stake-constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useMemo } from 'react'
import { StableSwapPoolName } from '../stableswap/constants'
import useStablePoolsData from '../../hooks/useStablePoolsData'
import useGetNonTriRewardsForPoolID from './useGetNonTriRewardsForPoolID'
import { useTokenBalance } from '../wallet/hooks'

// gets the staking info from the network for the active chain id
export function useSingleStableFarm(version: number, stableSwapPoolName: StableSwapPoolName): StakingTri {
  const { chainId, account } = useActiveWeb3React()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const { chefVersion, poolId } = activeFarms[version]

  const stakingInfoData = useFetchStakingInfoData()

  const v1args = [poolId.toString(), account?.toString()]

  const contract = useMasterChefV2ContractForVersion(chefVersion)

  const pendingTri = useSingleCallResult(contract, 'pendingTri', v1args) //user related
  const userInfo = useSingleCallResult(contract, 'userInfo', v1args) //user related
  const earnedNonTriRewards = useGetNonTriRewardsForPoolID(version)
  // get all the info from the staking rewards contracts
  const [stablePoolData] = useStablePoolsData(stableSwapPoolName)
  const totalStakedAmount = useTokenBalance(contract?.address, stablePoolData.lpToken ?? tokenAmount.token)

  const result = useMemo(() => {
    // Loading
    if (chainId == null || userInfo?.loading || pendingTri?.loading || earnedNonTriRewards?.loading) {
      return activeFarms[version]
    }

    // Error
    if (
      stablePoolData == null ||
      stablePoolData?.lpToken == null ||
      userInfo.error ||
      earnedNonTriRewards.error ||
      pendingTri.error ||
      stakingInfoData?.[version] == null
    ) {
      console.error('Failed to load staking rewards info')
      return activeFarms[version]
    }
    const userInfoPool = JSBI.BigInt(userInfo.result?.['amount'] ?? 0)
    const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)

    const stakedAmount = new TokenAmount(stablePoolData.lpToken, JSBI.BigInt(userInfoPool))
    const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))

    const { totalStakedInUSD, totalRewardRate, apr, nonTriAPRs } = stakingInfoData[version]

    return {
      ...activeFarms[version],
      isPeriodFinished: false,
      earnedAmount,
      stakedAmount,
      totalStakedAmount: totalStakedAmount ?? tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD),
      totalRewardRate: Math.round(totalRewardRate),
      rewardRate: tokenAmount,
      apr: Math.round(apr),
      nonTriAPRs: nonTriAPRs.map(data => ({ ...data, apr: Math.round(data.apr) })),
      earnedNonTriRewards: earnedNonTriRewards.result,
      hasNonTriRewards: nonTriAPRs.length > 0,
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
    earnedNonTriRewards?.loading,
    earnedNonTriRewards.error,
    earnedNonTriRewards.result,
    stablePoolData,
    stakingInfoData,
    version,
    activeFarms,
    totalStakedAmount,
    chefVersion
  ])

  return result
}
