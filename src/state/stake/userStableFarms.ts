import { ChainId, JSBI, TokenAmount, Token } from '@trisolaris/sdk'
import { useMemo } from 'react'

import { useComplexRewarderContract, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useBlockNumber } from '../application/hooks'

import { tokenAmount, ChefVersions, dummyToken, dummyAmount } from './stake-constants'
import { TRI } from '../../constants/tokens'
import { StableSwapPoolName, STABLE_FARMS, StableFarm } from '../stableswap/constants'

const MOCK_DATA = {
  allocPoint: 11,
  apr: 40.325080657227005,
  apr2: 0,
  chefVersion: 'v2',
  id: 25,
  lpAddress: '0x5EB99863f7eFE88c447Bc9D52AA800421b1de6c9',
  poolId: 18,
  totalRewardRate: 316008,
  totalStaked: 1,
  totalStakedInUSD: 1.028562,
  totalSupply: 162118860652705970000
}
// // gets the staking info from the network for the active chain id
export function useSingleStableFarm(stableFarmName: StableSwapPoolName): StableFarm {
  const stableFarm = STABLE_FARMS[ChainId.AURORA][stableFarmName]

  const { chainId, account } = useActiveWeb3React()
  const latestBlock = useBlockNumber()

  const { chefVersion, poolId, rewarderAddress } = stableFarm
  const stakingInfoData = useFetchStakingInfoData()

  //   TODO: Replace by real poolId

  //   const stableFarmStakingInfo = stakingInfoData?.find(stakingPool => stakingPool.poolId === poolId)
  const stableFarmStakingInfo = MOCK_DATA

  const complexRewarderContract = useComplexRewarderContract(rewarderAddress)

  const v1args = [poolId.toString(), account?.toString()]
  const v2args = [poolId.toString(), account?.toString(), '0']

  const contract = useMasterChefV2ContractForVersion(chefVersion)

  const pendingTri = useSingleCallResult(contract, 'pendingTri', v1args)
  const userInfo = useSingleCallResult(contract, 'userInfo', v1args)

  const pendingComplexRewards = useSingleCallResult(
    chefVersion === ChefVersions.V2 ? complexRewarderContract : null,
    'pendingTokens',
    v2args
  )

  const result = useMemo(() => {
    // Loading
    if (chainId == null || userInfo?.loading || pendingTri?.loading || pendingComplexRewards?.loading) {
      return stableFarm
    }

    //     // Error
    if (userInfo.error || pendingComplexRewards.error || pendingTri.error || !stableFarmStakingInfo) {
      console.error('Failed to load staking rewards info')
      return stableFarm
    }

    const userInfoPool = JSBI.BigInt(userInfo.result?.['amount'] ?? 0)
    const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)
    const earnedComplexRewardPool = JSBI.BigInt(pendingComplexRewards.result?.rewardAmounts?.[0] ?? 0)

    const stakedAmount = new TokenAmount(stableFarm.lpToken, JSBI.BigInt(userInfoPool))
    const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
    const earnedComplexAmount = new TokenAmount(stableFarm.doubleRewardToken, JSBI.BigInt(earnedComplexRewardPool))

    const { totalStakedInUSD, totalRewardRate, apr, apr2 } = stableFarmStakingInfo

    return {
      ...stableFarm,
      tokens: stableFarm.tokens,
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
  }, [chainId, userInfo, pendingTri, pendingComplexRewards, latestBlock])

  return result
}
