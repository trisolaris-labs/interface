import { ChainId, JSBI, TokenAmount, Fraction, Token } from '@trisolaris/sdk'
import { Interface } from '@ethersproject/abi'

import { useComplexRewarderMultipleContracts, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { useActiveWeb3React } from '../../hooks'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { PairState, usePairs } from '../../data/Reserves'
import { useFetchStakingInfoData } from '../../fetchers/farms'

import { addCommasToNumber } from '../../utils'

import COMPLEX_REWARDER from '../../constants/abis/complex-rewarder.json'
import { STAKING, ChefVersions } from './stake-constants'
import { TRI, AURORA } from '../../constants'
import { dummyToken } from './stake-constants'
import { BIG_INT_ZERO, ZERO_ADDRESS } from '../../constants'

import { CallState } from '../../state/multicall/hooks'

type FarmAmount = {
  [id: string]: {
    token: Token
    address: string
    amount: TokenAmount
  }
}

type Result = {
  dualRewards: { token: Token; tokenSymbol: string; amount: string; address: string }[]
  triRewards: TokenAmount
  triRewardsFriendlyAmount: string
  userTotalStaked: string
} | null

export function useFarmsPortfolio(farmIds?: number[]): Result {
  const farmsReady = farmIds?.length || true
  const { chainId, account: userAccount } = useActiveWeb3React()
  const account = userAccount ?? ZERO_ADDRESS
  const chain = chainId ?? ChainId.AURORA
  const activeFarms = STAKING[chain]

  const filteredFarms = farmIds ? activeFarms.filter(farm => farmIds?.includes(farm.ID)) : activeFarms
  const farms = filteredFarms.map(farm => ({
    farmId: farm.ID,
    chefVersion: farm.chefVersion,
    poolId: farm.poolId,
    rewarderAddress: farm.rewarderAddress,
    v1args: [farm.poolId.toString(), account],
    doubleRewardToken: activeFarms[farm.ID].doubleRewardToken
  }))

  const v1Farms = farms.filter(farm => farm.chefVersion === ChefVersions.V1)
  const v2Farms = farms.filter(farm => farm.chefVersion === ChefVersions.V2)

  const contractv1 = useMasterChefV2ContractForVersion(ChefVersions.V1)
  const contractv2 = useMasterChefV2ContractForVersion(ChefVersions.V2)

  const callResultIsLoading = (result: CallState[]) => {
    return result.some(data => data?.loading === true)
  }
  const callResultError = (result: CallState[]) => {
    return result.some(data => data?.error)
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
    [0, account, '0']
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
    token: pool.rewardToken,
    tokenAddr: pool.rewardToken.address,
    amount: new TokenAmount(AURORA[ChainId.AURORA], JSBI.BigInt(pool.rewardAmount))
  }))

  const complexRewardsFarmAmounts: FarmAmount = {}

  complexTokenAmounts?.forEach(tokenReward => {
    const tokenSymbol = tokenReward.token?.symbol ?? ''
    return complexRewardsFarmAmounts.hasOwnProperty(tokenSymbol)
      ? (complexRewardsFarmAmounts[tokenSymbol].amount = complexRewardsFarmAmounts[tokenSymbol].amount.add(
          tokenReward.amount
        ))
      : (complexRewardsFarmAmounts[tokenSymbol] = {
          token: tokenReward.token,
          amount: tokenReward.amount,
          address: tokenReward.tokenAddr
        })
  })

  const complexRewardsFriendlyFarmAmounts = Object.entries(complexRewardsFarmAmounts).map(([name, value]) => ({
    token: value.token,
    tokenSymbol: name,
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

  const allPendingTri = [...pendingTriDataV1, ...pendingTriDataV2]

  const pendingTriLoading = callResultIsLoading(allPendingTri)

  const earnedTriRewardPools = allPendingTri.length
    ? allPendingTri.map(farmData => JSBI.BigInt(farmData?.result?.[0] ?? 0))
    : []

  const allEarnedTriAmounts = earnedTriRewardPools.length
    ? earnedTriRewardPools
        .map(poolReward => new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(poolReward)))
        .reduce((a: TokenAmount, b) => a.add(b))
    : new TokenAmount(dummyToken, JSBI.BigInt(BIG_INT_ZERO))

  const totalTriAmount = allEarnedTriAmounts

  const stakingInfoData = useFetchStakingInfoData()

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

  const allUserInfo = [...userInfoV1, ...userInfoV2]

  const tokens = activeFarms.map(farm => farm.tokens)
  const pairsResult = usePairs(tokens)

  // Loading
  if (complexRewardsLoading || pendingTriLoading || pairsResult.some(pair => pair[0] === PairState.LOADING)) return null

  // Error
  if (
    callResultError(userInfoV1) ||
    callResultError(userInfoV2) ||
    callResultError(pendingComplexRewards) ||
    callResultError(pendingTriDataV1) ||
    callResultError(pendingTriDataV2) ||
    !stakingInfoData ||
    pairsResult.some(pair => pair[1] === null)
  ) {
    console.error('Failed to load staking rewards info')
    return null
  }

  const totalStaked = activeFarms.map((_, index) => {
    const { totalStakedInUSD, totalStaked } = stakingInfoData?.[index] ?? {}

    const userInfoPool = JSBI.BigInt(allUserInfo[index].result?.['amount'] ?? 0)
    const totalStakedTokenAmount = new TokenAmount(dummyToken, JSBI.BigInt(totalStaked))
    const stakedAmount = new TokenAmount(pairsResult[index][1]?.liquidityToken ?? dummyToken, JSBI.BigInt(userInfoPool))
    const userLPShare = stakedAmount.divide(totalStakedTokenAmount)
    const userLPAmountUSD = userLPShare?.multiply(JSBI.BigInt(Math.round(totalStakedInUSD)))

    return userLPAmountUSD
  })

  const totalUserStakedUSD = totalStaked.reduce((acum: Fraction, cur) => acum.add(cur), new Fraction(JSBI.BigInt(0)))
  const totalUserStakedUSDFormatted =
    totalUserStakedUSD != null ? `$${addCommasToNumber(totalUserStakedUSD.toFixed(2))}` : '$0'

  return {
    dualRewards: complexRewardsFriendlyFarmAmounts,
    triRewards: totalTriAmount,
    triRewardsFriendlyAmount: totalTriAmount?.toFixed(6),
    userTotalStaked: totalUserStakedUSDFormatted
  }
}
