import { ChainId, JSBI, TokenAmount, Token } from '@trisolaris/sdk'
import { Interface } from '@ethersproject/abi'

import { useComplexRewarderMultipleContracts, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { useActiveWeb3React } from '../../hooks'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { PairState, usePair } from '../../data/Reserves'

import COMPLEX_REWARDER from '../../constants/abis/complex-rewarder.json'
import { STAKING, ChefVersions } from './stake-constants'
import { TRI, AURORA } from '../../constants'
import { dummyToken } from './stake-constants'
import { BIG_INT_ZERO } from '../../constants'

import { CallState } from '../../state/multicall/hooks'

type FarmAmount = {
  [id: string]: {
    address: string
    amount: TokenAmount
  }
}

type Result = {
  dualRewards: { token: string; amount: string; address: string }[]
  triRewards: TokenAmount
  triRewardsdFriendly: string
} | null

export function useFarmsPortfolio(farmIds?: number[]): Result {
  const farmsReady = farmIds?.length || true
  const { chainId, account } = useActiveWeb3React()
  const chain = chainId ?? ChainId.AURORA
  const activeFarms = STAKING[chain]

  const filteredFarms = farmIds ? activeFarms.filter(farm => farmIds?.includes(farm.ID)) : activeFarms
  const farms = filteredFarms.map(farm => ({
    farmId: farm.ID,
    chefVersion: farm.chefVersion,
    poolId: farm.poolId,
    rewarderAddress: farm.rewarderAddress,
    v1args: [farm.poolId.toString(), account?.toString()],
    doubleRewardToken: activeFarms[farm.ID].doubleRewardToken
  }))

  const v1Farms = farms.filter(farm => farm.chefVersion === ChefVersions.V1)
  const v2Farms = farms.filter(farm => farm.chefVersion === ChefVersions.V2)

  const contractv1 = useMasterChefV2ContractForVersion(ChefVersions.V1)
  const contractv2 = useMasterChefV2ContractForVersion(ChefVersions.V2)

  const callResultIsLoading = (result: CallState[]) => {
    return result.some(data => data?.loading === true)
  }

  // Complex rewards

  const complexRewarderAddressList = v2Farms.map(farm => farm.rewarderAddress).filter(address => address)
  const complexRewarderContractList = useComplexRewarderMultipleContracts(complexRewarderAddressList)

  const complexRewardsContractAdressList =
    complexRewarderContractList?.map(contract => (complexRewarderContractList ? contract?.address : undefined)) ?? []

  const pendingComplexRewards = useMultipleContractSingleData(
    complexRewardsContractAdressList,
    new Interface(COMPLEX_REWARDER),
    'pendingTokens',
    [0, account?.toString(), '0']
  )

  const complexRewardsLoading = callResultIsLoading(pendingComplexRewards)

  const mapDoubleRewardToken = (addressToSearch: string) => {
    const farm = v2Farms.find(farm => farm.doubleRewardToken.address === addressToSearch)
    return farm?.doubleRewardToken
  }

  const earnedComplexRewardPool =
    pendingComplexRewards.length && !complexRewardsLoading
      ? pendingComplexRewards.map(farmData => ({
          rewardAmount: JSBI.BigInt(farmData?.result?.rewardAmounts?.[0] ?? 0),
          rewardToken: mapDoubleRewardToken(farmData?.result?.rewardTokens[0]) ?? dummyToken
        }))
      : null

  const complexTokenAmounts = earnedComplexRewardPool?.map(pool => ({
    token: pool.rewardToken.symbol,
    tokenAddr: pool.rewardToken.address,
    amount: new TokenAmount(AURORA[ChainId.AURORA], JSBI.BigInt(pool.rewardAmount))
  }))

  const complexRewardsFarmAmounts: FarmAmount = {}

  complexTokenAmounts?.forEach(tokenReward => {
    const tokenSymbol = tokenReward.token ?? 'ZERO'
    return complexRewardsFarmAmounts.hasOwnProperty(tokenSymbol)
      ? (complexRewardsFarmAmounts[tokenSymbol].amount = complexRewardsFarmAmounts[tokenSymbol].amount.add(
          tokenReward.amount
        ))
      : (complexRewardsFarmAmounts[tokenSymbol] = { amount: tokenReward.amount, address: tokenReward.tokenAddr })
  })

  const complexRewardsFriendlyFarmAmounts = Object.entries(complexRewardsFarmAmounts).map(([name, value]) => ({
    token: name,
    amount: value.amount.toFixed(6),
    address: value.address
  }))

  //
  //
  // Tri rewards

  const pendingTriDataV1 = useSingleContractMultipleData(
    farmsReady ? contractv1 : null,
    'pendingTri',
    farmsReady ? v1Farms.map(farm => farm.v1args) : []
  )

  const pendingTriDataV2 = useSingleContractMultipleData(
    farmsReady ? contractv2 : null,
    'pendingTri',
    farmsReady ? v2Farms.map(farm => farm.v1args) : []
  )

  const pendingTriLoading = callResultIsLoading(pendingTriDataV1) || callResultIsLoading(pendingTriDataV2)

  const earnedTriRewardPoolV1 = pendingTriDataV1.length
    ? pendingTriDataV1.map(farmData => JSBI.BigInt(farmData?.result?.[0] ?? 0))
    : []

  const earnedTriRewardPoolV2 = pendingTriDataV2.length
    ? pendingTriDataV2.map(farmData => JSBI.BigInt(farmData?.result?.[0] ?? 0))
    : []

  const allEarnedTriAmountsV1 = earnedTriRewardPoolV1.length
    ? earnedTriRewardPoolV1
        .map(poolReward => new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(poolReward)))
        .reduce((a: TokenAmount, b) => a.add(b))
    : new TokenAmount(dummyToken, JSBI.BigInt(BIG_INT_ZERO))

  const allEarnedTriAmountsV2 = earnedTriRewardPoolV2.length
    ? earnedTriRewardPoolV2
        .map(poolReward => new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(poolReward)))
        .reduce((a: TokenAmount, b) => a.add(b))
    : new TokenAmount(dummyToken, JSBI.BigInt(BIG_INT_ZERO))

  const totalTriAmount = allEarnedTriAmountsV1.add(allEarnedTriAmountsV2)

  //
  //
  // Staked Info

  const userInfoV1 = useSingleContractMultipleData(
    farmsReady ? contractv1 : null,
    'userInfo',
    farmsReady ? v1Farms.map(farm => farm.v1args) : []
  )

  const userInfoV2 = useSingleContractMultipleData(
    farmsReady ? contractv2 : null,
    'userInfo',
    farmsReady ? v2Farms.map(farm => farm.v1args) : []
  )

  const tokens = activeFarms.find(({ ID }) => ID === v2Farms[1].farmId)?.tokens
  const [tokenA, tokenB] = tokens ?? []
  const [pairState, pair] = usePair(tokenA, tokenB)
  // console.log(JSBI.BigInt(userInfoV2[1].result?.['amount'] ?? 0))
  console.log(pair)

  return complexRewardsLoading || pendingTriLoading
    ? null
    : {
        dualRewards: complexRewardsFriendlyFarmAmounts,
        triRewards: totalTriAmount,
        triRewardsdFriendly: totalTriAmount?.toFixed(6)
      }
}
