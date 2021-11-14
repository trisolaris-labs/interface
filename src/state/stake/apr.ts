import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR } from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS } from './hooks-sushi'
import {
  STAKING,
  StakingTri,
  TRI,
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
  const stakingTotalSupplies = useMultipleContractSingleData(lpAddresses, ERC20_INTERFACE, 'balanceOf', accountArg) //totalStaked TO REPLACE
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
      // const rewardsPending = pendingTri[index]

      // these get fetched regardless of account
      const stakingTotalSupplyState = stakingTotalSupplies[index]
      const [pairState, pair] = pairs[index]

      if (
        // always need these
        userStaked?.loading === false &&
        stakingTotalSupplyState?.loading === false &&
        pair &&
        pairState !== PairState.LOADING &&
        stakingInfoData
      ) {
        if (
          userStaked.error ||
          stakingTotalSupplyState.error ||
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
        const userInfoPool = JSBI.BigInt(userStaked.result?.['amount'])
        const totalSupplyStaked = JSBI.BigInt(stakingTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))

        const totalStakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(totalSupplyStaked))

        const reserveInUSDC = tokenAmount

        const totalStakedInUSD = Math.round(stakingInfoData[index].totalStakedInUSD)
        // const totalStakedInUSD = 100
        // apr calculation
        const totalRewardRate = new TokenAmount(
          TRI,
          JSBI.divide(JSBI.multiply(rewardsPerSecond, JSBI.BigInt(activeFarms[index].allocPoint)), totalAllocPoints)
        ) // TO REPLACE
        const rewardRate = new TokenAmount(
          TRI,
          JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
            ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
            : JSBI.BigInt(0)
        )

        const apr = Math.round(Number(String(stakingInfoData[index].apr)))

        memo.push({
          ID: activeFarms[index].ID,
          stakingRewardAddress: MASTERCHEF_ADDRESS[chainId],
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: tokenAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedInUSD: totalStakedInUSD,
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: totalRewardRate,
          rewardRate: rewardRate,
          apr: apr
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [activeFarms, stakingTotalSupplies, pairs, userInfo])
}
