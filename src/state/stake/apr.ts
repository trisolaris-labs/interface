import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR, TRI} from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS } from './hooks-sushi'
import {
  STAKING,
  StakingTri,
  rewardsPerSecond,
  totalAllocPoints,
  tokenAmount,
  aprData,
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
  let lpAddresses = activeFarms.map(key => key.stakingRewardAddress)
  const chefContract = useMasterChefContract()

  const [stakingInfoData, setStakingInfoData] = useState<ExternalInfo[]>()

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
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
  const accountArg = useMemo(() => [chefContract?.address ?? undefined], [chefContract])
  const tokens = useMemo(() => activeFarms.map(({ tokens }) => tokens), [activeFarms])
  // const stakingTotalSupplies = useMultipleContractSingleData(lpAddresses, ERC20_INTERFACE, 'balanceOf', accountArg) //totalStaked TO REPLACE
  const pairs = usePairs(tokens)

  const pairAddresses = useMemo(() => {
    const pairsHaveLoaded = pairs?.every(([state, pair]) => state === PairState.EXISTS)
    if (!pairsHaveLoaded) return []
    else return pairs.map(([state, pair]) => pair?.liquidityToken.address)
  }, [pairs])

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
        // do whatever

        // check for account, if no account set to 0
        const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))

        memo.push({
          ID: activeFarms[index].ID,
          stakingRewardAddress: MASTERCHEF_ADDRESS[chainId],
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: tokenAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: tokenAmount,
          totalStakedInUSD: Math.round(stakingInfoData[index].totalStakedInUSD),
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: Math.round(stakingInfoData[index].totalRewardRate),
          rewardRate: tokenAmount,
          apr: Math.round((stakingInfoData[index].apr))
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [activeFarms, pairs, userInfo])
}
