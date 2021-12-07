import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR, TRI} from '../../constants'
import { useMasterChefContract, useMasterChefV2Contract, MASTERCHEF_ADDRESS_V1,MASTERCHEF_ADDRESS_V2 } from './hooks-sushi'
import {
  STAKING,
  StakingTri,
  rewardsPerSecond,
  totalAllocPoints,
  tokenAmount,
  ExternalInfo
} from './stake-constants'
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
export function useFarms(): StakingTri[] {
  const { chainId, account } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ? chainId! : ChainId.AURORA]
  let lpAddresses = activeFarms.map(key => key.lpAddress)
  const chefContract = useMasterChefContract()
  const chefContractv2 = useMasterChefV2Contract()

  const [stakingInfoData, setStakingInfoData] = useState<ExternalInfo[]>()

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/datav2.json')
      .then(results => results.json())
      .then(data => {
        setStakingInfoData(data)
      })
  }, [])

  // user info
  const args = useMemo(() => {
    if (!account || !lpAddresses) {
      return
    }
    return [...Array(lpAddresses.length).keys()].map(pid => [String(pid), String(account)])
  }, [lpAddresses.length, account])

  const userInfo = useSingleContractMultipleData(args ? chefContract : null, 'userInfo', args!) //user related

  // get all the info from the staking rewards contracts
  const tokens = useMemo(() => activeFarms.map(({ tokens }) => tokens), [activeFarms])
  const pairs = usePairs(tokens)

  return useMemo(() => {
    if (!chainId) return activeFarms

    return lpAddresses.reduce<StakingTri[]>((memo, lpAddress, index) => {
      // User based info
      const userStaked = userInfo[index]

      const [pairState, pair] = pairs[index]

      if (
        // always need these
        !userStaked?.loading &&
        pair &&
        pairState !== PairState.LOADING &&
        stakingInfoData
      ) {
        if (
          userStaked?.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS ||
          !stakingInfoData
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = activeFarms[index].tokens

        const chefVersion = activeFarms[index].chefVersion
        // do whatever

        // check for account, if no account set to 0
        const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))

        memo.push({
          ID: activeFarms[index].ID,
          poolId: activeFarms[index].poolId,
          stakingRewardAddress: activeFarms[index].stakingRewardAddress,
          lpAddress: activeFarms[index].lpAddress,
          rewarderAddress: activeFarms[index].rewarderAddress,
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: tokenAmount,
          doubleRewardAmount: tokenAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: tokenAmount,
          totalStakedInUSD: Math.round(stakingInfoData[index].totalStakedInUSD),
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: Math.round(stakingInfoData[index].totalRewardRate),
          rewardRate: tokenAmount,
          apr: Math.round((stakingInfoData[index].apr)),
          apr2: Math.round((stakingInfoData[index].apr2)),
          chefVersion:chefVersion
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [activeFarms, pairs, userInfo])
}
