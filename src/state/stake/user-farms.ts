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
export function useSingleFarm(version: number): StakingTri {
  const { chainId, account } = useActiveWeb3React()
  const latestBlock = useBlockNumber();
  const activeFarms = STAKING[chainId ?? ChainId.AURORA];
  const { chefVersion, poolId, rewarderAddress } = activeFarms[version];

  const stakingInfoData = useFetchStakingInfoData();
  const complexRewarderContract = useComplexRewarderContract(rewarderAddress);

  const v1args = [poolId.toString(), account?.toString()];
  const v2args = [poolId.toString(), account?.toString(), '0'];

  const contract = useMasterChefV2ContractForVersion(chefVersion)

  const pendingTri = useSingleCallResult(contract, 'pendingTri', v1args) //user related
  const userInfo = useSingleCallResult(contract, 'userInfo', v1args)  //user related
  const pendingComplexRewards = useSingleCallResult(
    chefVersion === ChefVersions.V2 ? complexRewarderContract : null,
    'pendingTokens',
    v2args,
  )
  // get all the info from the staking rewards contracts
  const tokens = activeFarms.find(({ ID }) => ID === version)?.tokens;
  const [tokenA, tokenB] = tokens ?? [];
  const [pairState, pair] = usePair(tokenA, tokenB);

  const result = useMemo(() => {

    // Loading
    if (
      chainId == null ||
      userInfo?.loading ||
      pendingTri?.loading ||
      pendingComplexRewards?.loading ||
      pairState === PairState.LOADING
    ) {
      return activeFarms[version]
    }

    // Error
    if (
      userInfo.error ||
      pendingComplexRewards.error ||
      pendingTri.error ||
      pair == null ||
      stakingInfoData?.[version] == null ||
      tokenA == null ||
      tokenB == null
    ) {
      console.error('Failed to load staking rewards info');
      return activeFarms[version];
    }
    console.log(pendingComplexRewards)
    const userInfoPool = JSBI.BigInt(userInfo.result?.['amount'] ?? 0)
    const earnedRewardPool = JSBI.BigInt(pendingTri.result?.[0] ?? 0)
    const earnedComplexRewardPool = JSBI.BigInt(pendingComplexRewards.result?.rewardAmounts?.[0] ?? 0)
    console.log(earnedComplexRewardPool)
    const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
    const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
    const earnedComplexAmount = new TokenAmount(AURORA[ChainId.AURORA], JSBI.BigInt(earnedComplexRewardPool))

    const {
      totalStakedInUSD,
      totalRewardRate,
      apr,
      apr2,
    } = stakingInfoData[version];


    return {
      ...activeFarms[version],
      tokens: tokens!,
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
      chefVersion,
    }
  }, [
    chainId,
    userInfo,
    pendingTri,
    pendingComplexRewards,
    pairState,
    tokens,
    tokenA,
    tokenB,
    latestBlock,
  ]);

  return result;
}