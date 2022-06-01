import { ChainId, JSBI, TokenAmount, Fraction, Token, Pair } from '@trisolaris/sdk'
import { Interface } from '@ethersproject/abi'

import { useComplexRewarderMultipleContracts, useMasterChefV2ContractForVersion } from './hooks-sushi'
import { useActiveWeb3React } from '../../hooks'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { PairState, usePairs } from '../../data/Reserves'
import { useFetchStakingInfoData } from '../../fetchers/farms'

import { addCommasToNumber } from '../../utils'

import COMPLEX_N_REWARDER_ABI from '../../constants/abis/complex-n-rewarder.json'
import { STAKING, ChefVersions } from './stake-constants'
import { TRI } from '../../constants/tokens'
import { dummyToken } from './stake-constants'
import { BIG_INT_ZERO, ZERO_ADDRESS } from '../../constants'

import { CallState } from '../../state/multicall/hooks'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../stableswap/constants'
import _ from 'lodash'
import useGetTokenByAddress from '../../hooks/useGetTokenByAddress'

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
}

export function useFarmsPortfolio(farmIds?: number[]): Result | null {
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
    nonTriRewardTokens: activeFarms[farm.ID].earnedNonTriRewards.map(({ token }) => token)
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

  const complexRewardsContractAddressList =
    complexRewarderContractList?.map(contract => (complexRewarderContractList ? contract?.address : undefined)) ?? []

  const pendingComplexRewards = useMultipleContractSingleData(
    complexRewardsContractAddressList,
    new Interface(COMPLEX_N_REWARDER_ABI),
    'pendingTokens',
    [0, account, '0']
  )

  const getTokenByAddress = useGetTokenByAddress()
  const complexRewardsLoading = callResultIsLoading(pendingComplexRewards)

  const earnedComplexRewardPool = complexRewardsLoading
    ? null
    : pendingComplexRewards.reduce((acc: { rewardAmount: any; rewardToken: Token }[], farmData) => {
        if (farmData.result?.rewardAmounts != null && Number(farmData.result?.rewardAmounts?.length) > 0) {
          farmData.result.rewardAmounts.forEach((amount: any, i: number) => {
            acc.push({
              rewardAmount: amount,
              rewardToken: getTokenByAddress(farmData?.result?.rewardTokens[i])
            })
          })
        }

        return acc
      }, [])

  const complexTokenAmounts = earnedComplexRewardPool?.map(pool => ({
    token: pool.rewardToken,
    tokenAddr: pool.rewardToken.address,
    amount: new TokenAmount(pool.rewardToken, JSBI.BigInt(pool.rewardAmount))
  }))

  const complexRewardsFarmAmounts: FarmAmount = {}

  complexTokenAmounts?.forEach(({ token, amount, tokenAddr }) => {
    const tokenSymbol = token?.symbol ?? ''
    if (complexRewardsFarmAmounts.hasOwnProperty(tokenSymbol)) {
      complexRewardsFarmAmounts[tokenSymbol].amount = complexRewardsFarmAmounts[tokenSymbol].amount.add(amount)
    } else {
      complexRewardsFarmAmounts[tokenSymbol] = { amount, address: tokenAddr, token }
    }
  })

  const complexRewardsFriendlyFarmAmounts = Object.entries(complexRewardsFarmAmounts).map(
    ([name, { amount, address, token }]) => ({
      token,
      tokenSymbol: name,
      amount: amount.toFixed(6),
      address
    })
  )

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
        .reduce((a: TokenAmount, b) => a.add(b), new TokenAmount(TRI[ChainId.AURORA], BIG_INT_ZERO))
    : new TokenAmount(dummyToken, JSBI.BigInt(BIG_INT_ZERO))

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

  const tokens: [Token, Token][] = activeFarms.map(({ tokens: [token0, token1] }) => [token0, token1])
  const pairsResult = usePairs(tokens)

  // Loading
  if (complexRewardsLoading || pendingTriLoading || pairsResult.some(pair => pair[0] === PairState.LOADING)) {
    return null
  }

  // Error
  if (
    callResultError(userInfoV1) ||
    callResultError(userInfoV2) ||
    callResultError(pendingComplexRewards) ||
    callResultError(pendingTriDataV1) ||
    callResultError(pendingTriDataV2) ||
    !stakingInfoData
  ) {
    console.error('Failed to load staking rewards info')
    return null
  }

  const totalStaked = activeFarms.map(({ stableSwapPoolName }, index) => {
    if (!stakingInfoData[index] || stakingInfoData[index].totalStaked === 0) {
      return new Fraction(BIG_INT_ZERO)
    }

    const { totalStakedInUSD, totalStaked } = stakingInfoData?.[index]

    const userInfoPool = JSBI.BigInt(allUserInfo[index].result?.['amount'] ?? 0)
    const totalStakedTokenAmount = new TokenAmount(dummyToken, JSBI.BigInt(totalStaked))
    const lpToken = getLPToken(pairsResult[index][1] ?? null, stableSwapPoolName)
    const stakedAmount = new TokenAmount(lpToken, JSBI.BigInt(userInfoPool))
    const userLPShare = stakedAmount.divide(totalStakedTokenAmount)
    const userLPAmountUSD = userLPShare?.multiply(JSBI.BigInt(Math.round(totalStakedInUSD)))

    return userLPAmountUSD
  })

  const totalUserStakedUSD = totalStaked.reduce((acum: Fraction, cur) => acum.add(cur), new Fraction(BIG_INT_ZERO))
  const totalUserStakedUSDFormatted = `$${addCommasToNumber(totalUserStakedUSD?.toFixed(2) ?? '0')}`

  return {
    dualRewards: complexRewardsFriendlyFarmAmounts,
    triRewards: allEarnedTriAmounts,
    triRewardsFriendlyAmount: allEarnedTriAmounts?.toFixed(6),
    userTotalStaked: totalUserStakedUSDFormatted
  }
}

function getLPToken(pair: Pair | null, stableSwapPoolName: StableSwapPoolName | null) {
  if (stableSwapPoolName != null) {
    return STABLESWAP_POOLS[stableSwapPoolName].lpToken
  }

  if (pair != null) {
    return pair.liquidityToken
  }

  return dummyToken
}
