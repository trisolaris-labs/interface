import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR, TRI} from '../../constants'
import { useMasterChefContract, useMasterChefV2Contract, useComplexRewarderContract, MASTERCHEF_ADDRESS_V1 } from './hooks-sushi'
import { STAKING, StakingTri, rewardsPerSecond, totalAllocPoints, tokenAmount, ExternalInfo } from './stake-constants'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  useSingleCallResult,
  NEVER_RELOAD
} from '../../state/multicall/hooks'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useMemo, useState, useEffect } from 'react'
import { PairState, usePairs, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'

// gets the staking info from the network for the active chain id
export function useSingleFarm(version: string): StakingTri[] {
  const { chainId, account } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ? chainId! : ChainId.AURORA]
  let addresses = activeFarms.map(key => key.lpAddress)
  const chefContract = useMasterChefContract()
  const chefContractv2 = useMasterChefV2Contract()
  const [stakingInfoData, setStakingInfoData] = useState<ExternalInfo[]>()
  const complexRewarderContract = useComplexRewarderContract(String(activeFarms[Number(version)].rewarderAddress))


  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/datav2.json')
      .then(results => results.json())
      .then(data => {
        setStakingInfoData(data)
      })
  }, [])


  let lpAddresses = [String(addresses[Number(version)])]

  const args = useMemo(() => {
    if (!account || !version) {
      return
    }
    return [String(activeFarms[Number(version)].poolId), String(account)]
  }, [version, account])


  const args2 = useMemo(() => {
    if (!account || !version) {
      return
    }
    return [String(activeFarms[Number(version)].poolId), String(account), "0"]
  }, [version, account])

  console.log(args2)

  var contract = chefContract
  if (activeFarms[Number(version)].chefVersion != 0) {
    var contract = chefContractv2
  }
    //TODO args are incorrect here
  const pendingTri = useSingleCallResult(args ? contract : null, 'pendingTri', args!) //user related
  const userInfo = useSingleCallResult(args ? contract : null, 'userInfo', args!)  //user related
  const complexRewards = useSingleCallResult(args2 ? complexRewarderContract : null, 'pendingTokens', args2!)

  console.log(complexRewards)

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => activeFarms.filter(farm => {
        return farm.ID == Number(version)
      }).map(({ tokens }) => tokens), [activeFarms])

  const pairs = usePairs(tokens)


  return useMemo(() => {
    if (!chainId) return activeFarms

    return lpAddresses.reduce<StakingTri[]>((memo, lpAddress, index) => {
      // User based info
      const userStaked = userInfo
      const rewardsPending = pendingTri
      const [pairState, pair] = pairs[index]

      if (
        // always need these
        userStaked?.loading === false &&
        rewardsPending?.loading === false &&
        pair &&
        pairState !== PairState.LOADING && stakingInfoData
      ) {
        if (
          userStaked.error ||
          rewardsPending.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS || !stakingInfoData
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = activeFarms[Number(version)].tokens
        // data from offchain
        // check for account, if no account set to 0
        const userInfoPool = JSBI.BigInt(userStaked.result?.['amount'])
        const earnedRewardPool = JSBI.BigInt(rewardsPending.result?.[0])

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
        const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
        const chefVersion = activeFarms[Number(version)].chefVersion

        memo.push({
          ID: activeFarms[Number(version)].ID,
          poolId: activeFarms[Number(version)].poolId,
          stakingRewardAddress: activeFarms[Number(version)].stakingRewardAddress,
          lpAddress: activeFarms[Number(version)].lpAddress,
          rewarderAddress: activeFarms[Number(version)].rewarderAddress,
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: earnedAmount,
          doubleRewardAmount: earnedAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: tokenAmount,
          totalStakedInUSD: Math.round(stakingInfoData[Number(version)].totalStakedInUSD),
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: Math.round(stakingInfoData[Number(version)].totalRewardRate),
          rewardRate: tokenAmount,
          apr: Math.round(stakingInfoData[Number(version)].apr),
          apr2: Math.round(stakingInfoData[Number(version)].apr2),
          chefVersion: chefVersion
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [
    activeFarms,
    pairs,
    pendingTri,
    userInfo
  ])
}
