import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR } from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS } from './hooks-sushi'
import { STAKING, StakingTri, TRI, rewardsPerSecond, totalAllocPoints, tokenAmount, aprData } from './stake-constants'
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
  useSingleCallResult,
  NEVER_RELOAD
} from '../../state/multicall/hooks'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useMemo } from 'react'
import { PairState, usePairs, usePair } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'

// gets the staking info from the network for the active chain id
export function useSingleFarm(version: string): StakingTri[] {
  const { chainId, account } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ? chainId! : ChainId.AURORA]
  let addresses = activeFarms.map(key => key.stakingRewardAddress)
  const chefContract = useMasterChefContract()

  let lpAddresses = [String(addresses[Number(version)])]

  const args = useMemo(() => {
    if (!account || !version) {
      return
    }
    return [String(version), String(account)]
  }, [version, account])


  const pendingTri = useSingleCallResult(args ? chefContract : null, 'pendingTri', args!) //user related
  const userInfo = useSingleCallResult(args ? chefContract : null, 'userInfo', args!)  //user related

  // get all the info from the staking rewards contracts
  const accountArg = useMemo(() => [chefContract?.address ?? undefined], [chefContract])
  const tokens = useMemo(() => activeFarms.filter(farm => {
        return farm.ID == Number(version)
      }).map(({ tokens }) => tokens), [activeFarms])

  // const stakingTotalSupplies = useMultipleContractSingleData(lpAddresses, ERC20_INTERFACE, 'balanceOf', accountArg) //totalStaked TO REPLACE
  const pairs = usePairs(tokens)



  const pairAddresses = useMemo(() => {
    const pairsHaveLoaded = pairs?.every(([state, pair]) => state === PairState.EXISTS)
    if (!pairsHaveLoaded) return []
    else return pairs.map(([state, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply') //totalSupply TO REPLACE

  return useMemo(() => {
    if (!chainId) return activeFarms

    return lpAddresses.reduce<StakingTri[]>((memo, lpAddress, index) => {
      // User based info
      const userStaked = userInfo
      const rewardsPending = pendingTri
      // these get fetched regardless of account
      // const stakingTotalSupplyState = stakingTotalSupplies[index]
      const [pairState, pair] = pairs[index]
      const pairTotalSupplyState = pairTotalSupplies[index]


      if (
        // always need these
        userStaked?.loading === false &&
        rewardsPending?.loading === false &&
        // stakingTotalSupplyState?.loading === false &&
        pairTotalSupplyState?.loading === false &&
        pair &&
        pairState !== PairState.LOADING
      ) {
        if (
          userStaked.error ||
          rewardsPending.error ||
          // stakingTotalSupplyState.error ||
          pairTotalSupplyState.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = activeFarms[Number(version)].tokens
        // do whatever


        // check for account, if no account set to 0
        const userInfoPool = JSBI.BigInt(userStaked.result?.['amount'])
        const earnedRewardPool = JSBI.BigInt(rewardsPending.result?.[0])
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
        const earnedAmount = new TokenAmount(TRI, JSBI.BigInt(earnedRewardPool))



        const apr = 9 // TO REPLACE

        memo.push({
          ID: activeFarms[Number(version)].ID,
          stakingRewardAddress: MASTERCHEF_ADDRESS[chainId],
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: earnedAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: tokenAmount,
          totalStakedInUSD: 10,//TODO FIX
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: tokenAmount,
          rewardRate: tokenAmount,
          apr: apr
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [
    activeFarms,
    pairs,
    pairTotalSupplies,
    pendingTri,
    userInfo
  ])
}
