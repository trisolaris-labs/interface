import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { TRI, AURORA } from '../../constants'
import { useComplexRewarderMultipleContracts, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { STAKING, StakingTri, tokenAmount, ChefVersions } from './stake-constants'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { PairState, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useFetchStakingInfoData } from '../../fetchers/farms'
import { useMemo } from 'react'
import { useBlockNumber } from '../application/hooks'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { Interface } from '@ethersproject/abi'
import masterchefAbi from '../../constants/abis/masterchefv2.json'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import COMPLEX_REWARDER from '../../constants/abis/complex-rewarder.json'

// gets the staking info from the network for the active chain id
export function useMultipleUserFarms(farmsVersions: number[]): null {
  const farmsReady = farmsVersions.length
  const { chainId, account } = useActiveWeb3React()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]

  const filteredFarms = activeFarms
    .filter(farm => farmsVersions.includes(farm.ID))
    .map(farm => ({
      chefVersion: farm.chefVersion,
      poolId: farm.poolId,
      rewarderAddress: farm.rewarderAddress,
      v1args: [farm.poolId.toString(), account?.toString()],
      v2args: [farm.poolId.toString(), account?.toString(), '0']
    }))

  // for complex rewards
  const rewarderAddressList = filteredFarms.map(farm => farm.rewarderAddress).filter(address => address)

  const contract = useMasterChefV2ContractForVersion(1)

  const complexRewarderContractList = useComplexRewarderMultipleContracts(rewarderAddressList)

  // const pendingComplexRewards = useSingleCallResult(
  //   complexRewarderContractList ? complexRewarderContractList[0] : null,
  //   'pendingTokens',
  //   ['1', '0x85BD2E6Ab9D510C9c8a1B4B50B7Ace28528Bb385', '0']
  // )

  // console.log(complexRewarderContractList)
  const pendingComplexRewardsTest = useMultipleContractSingleData(
    [complexRewarderContractList ? complexRewarderContractList[0].address : undefined],
    new Interface(COMPLEX_REWARDER),
    'pendingTokens',
    ['1', '0x85BD2E6Ab9D510C9c8a1B4B50B7Ace28528Bb385', '0']
  )

  console.log(pendingComplexRewardsTest)

  // const earnedComplexRewardPool = JSBI.BigInt(pendingComplexRewards.result?.rewardAmounts?.[0] ?? 0)
  // const earnedComplexAmount = new TokenAmount(AURORA[ChainId.AURORA], JSBI.BigInt(earnedComplexRewardPool))
  // console.log(earnedComplexAmount.currency.symbol, earnedComplexAmount.toFixed(6))

  const PendingTriData = useSingleContractMultipleData(
    farmsReady ? contract : null,
    'pendingTri',
    farmsReady ? filteredFarms.map(farm => farm.v1args) : []
  )

  const earnedRewardPool = PendingTriData.length
    ? PendingTriData.map(farmData => JSBI.BigInt(farmData?.result?.[0] ?? 0))
    : null

  const allEarnedTriAmounts = earnedRewardPool
    ?.map(poolReward => new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(poolReward)))
    .reduce((a: TokenAmount, b) => a.add(b))

  return null
}
