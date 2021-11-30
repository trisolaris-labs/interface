import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR, TRI} from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS_V1 } from './hooks-sushi'
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

  const [stakingInfoData, setStakingInfoData] = useState<ExternalInfo[]>()


  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
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
      const [pairState, pair] = pairs[index]
      const pairTotalSupplyState = pairTotalSupplies[index]


      if (
        // always need these
        userStaked?.loading === false &&
        rewardsPending?.loading === false &&
        pairTotalSupplyState?.loading === false &&
        pair &&
        pairState !== PairState.LOADING && stakingInfoData
      ) {
        if (
          userStaked.error ||
          rewardsPending.error ||
          pairTotalSupplyState.error ||
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
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
        const earnedAmount = new TokenAmount(TRI[ChainId.AURORA], JSBI.BigInt(earnedRewardPool))
        const chefVersion = activeFarms[Number(version)].chefVersion


        memo.push({
          ID: activeFarms[Number(version)].ID,
          poolId: activeFarms[Number(version)].poolId,
          stakingRewardAddress: activeFarms[Number(version)].stakingRewardAddress,
          lpAddress: activeFarms[Number(version)].lpAddress,
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: earnedAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: tokenAmount,
          totalStakedInUSD: Math.round(stakingInfoData[Number(version)].totalStakedInUSD),
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: Math.round(stakingInfoData[Number(version)].totalRewardRate),
          rewardRate: tokenAmount,
          apr: Math.round(stakingInfoData[Number(version)].apr),
          apr2: 0,
          chefVersion: chefVersion
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
