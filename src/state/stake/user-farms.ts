import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { TRI } from '../../constants/tokens'
import { useMasterChefV2ContractForVersion } from './hooks-sushi'
import { STAKING, StakingTri, tokenAmount } from './stake-constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useMemo } from 'react'
import useGetNonTriRewardsForPoolID from './useGetNonTriRewardsForPoolID'
import { useTokenBalance } from '../wallet/hooks'

// gets the staking info from the network for the active chain id
export function useSingleFarm(version: number): StakingTri {
  const { chainId, account } = useActiveWeb3React()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const { chefVersion, poolId } = activeFarms[version]

  const stakingInfoData = useFetchStakingInfoData()

  const v1args = [poolId.toString(), account?.toString()]

  const contract = useMasterChefV2ContractForVersion(chefVersion)

  const pendingTri = useSingleCallResult(contract, 'pendingTri', v1args) //user related
  const userInfo = useSingleCallResult(contract, 'userInfo', v1args) //user related
  // get all the info from the staking rewards contracts
  const tokens = activeFarms.find(({ ID }) => ID === version)?.tokens
  const [tokenA, tokenB] = tokens ?? []
  const [pairState, pair] = usePair(tokenA, tokenB)
  const earnedNonTriRewards = useGetNonTriRewardsForPoolID(version)
  const totalStakedAmount = useTokenBalance(contract?.address, pair?.liquidityToken)

  const result = useMemo(() => {
    // Loading
    if (
      chainId == null ||
      userInfo?.loading ||
      pendingTri?.loading ||
      earnedNonTriRewards?.loading ||
      pairState === PairState.LOADING
    ) {
      return activeFarms[version]
    }

    // Error
    if (
      userInfo.error ||
      earnedNonTriRewards.error ||
      pendingTri.error ||
      pair == null ||
      stakingInfoData?.[version] == null ||
      tokenA == null ||
      tokenB == null
    ) {
      console.error('Failed to load staking rewards info')
      return activeFarms[version]
    }
    const userInfoPool = JSBI.BigInt(userInfo.result?.['amount'] ?? 0)
    const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)
    const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
    const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))

    const { totalStakedInUSD, totalRewardRate, apr, nonTriAPRs } = stakingInfoData[version]

    return {
      ...activeFarms[version],
      tokens: tokens!,
      isPeriodFinished: false,
      earnedAmount,
      stakedAmount,
      totalStakedAmount: totalStakedAmount ?? tokenAmount,
      totalStakedInUSD: Math.round(totalStakedInUSD),
      totalRewardRate: Math.round(totalRewardRate),
      rewardRate: tokenAmount,
      apr: Math.round(apr),
      nonTriAPRs,
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
    pairState,
    pair,
    stakingInfoData,
    version,
    tokenA,
    tokenB,
    activeFarms,
    tokens,
    totalStakedAmount,
    chefVersion
  ])

  return result
}
