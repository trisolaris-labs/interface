import { ChainId, Token, JSBI, Pair, WETH, TokenAmount } from '@trisolaris/sdk'
import { USDC, DAI, WNEAR } from '../../constants'
import { useMasterChefContract, MASTERCHEF_ADDRESS } from './hooks-sushi'
import { STAKING, StakingTri, TRI, rewardsPerSecond, totalAllocPoints, tokenAmount, aprData, ExternalInfo } from './stake-constants'
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
  console.log(aprData) // TODO: INPUT VALUES FROM THIS INTO VARIABLES

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

  console.log(stakingInfoData)

  // user info
  const args = useMemo(() => {
    if (!account || !lpAddresses) {
      return
    }
    return [...Array(lpAddresses.length).keys()].map(pid => [String(pid), String(account)])
  }, [lpAddresses.length, account])

  const pendingTri = useSingleContractMultipleData(args ? chefContract : null, 'pendingTri', args!) //user related
  const userInfo = useSingleContractMultipleData(args ? chefContract : null, 'userInfo', args!)  //user related

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

  // useTokenPrices(tokenAddresses)
  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply') //totalSupply TO REPLACE

  // get pairs for tvl calculation
  // const dai = DAI[chainId ? chainId! : ChainId.AURORA]
  // const usdc = USDC[chainId ? chainId! : ChainId.AURORA]
  // const wnear  = WNEAR[chainId ? chainId! : ChainId.AURORA]
  // const [daiUSDCPairState, daiUSDCPair] = usePair(dai, usdc);
  // const [triUSDCPairState, triUSDCPair] = usePair(TRI, usdc);
  // const [wnearUSDCPairState, wnearUSDCPair] = usePair(wnear, usdc);

  return useMemo(() => {
    if (!chainId) return activeFarms

    return lpAddresses.reduce<StakingTri[]>((memo, lpAddress, index) => {
      // User based info
      const userStaked = userInfo[index]
      const rewardsPending = pendingTri[index]

      // these get fetched regardless of account
      const stakingTotalSupplyState = stakingTotalSupplies[index]
      const [pairState, pair] = pairs[index]
      const pairTotalSupplyState = pairTotalSupplies[index]

      if (
        // always need these
        userStaked?.loading === false &&
        rewardsPending?.loading === false &&
        stakingTotalSupplyState?.loading === false &&
        pairTotalSupplyState?.loading === false &&
        pair &&
        pairState !== PairState.LOADING
        // &&
        // daiUSDCPair &&
        // daiUSDCPairState !== PairState.LOADING &&
        // triUSDCPair &&
        // triUSDCPairState !== PairState.LOADING &&
        // wnearUSDCPair &&
        // wnearUSDCPairState !== PairState.LOADING
      ) {
        if (
          userStaked.error ||
          rewardsPending.error ||
          stakingTotalSupplyState.error ||
          pairTotalSupplyState.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS
          // ||
          // daiUSDCPairState === PairState.INVALID ||
          // daiUSDCPairState === PairState.NOT_EXISTS ||
          // triUSDCPairState === PairState.INVALID ||
          // triUSDCPairState === PairState.NOT_EXISTS ||
          // wnearUSDCPairState === PairState.INVALID ||
          // wnearUSDCPairState === PairState.NOT_EXISTS
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = activeFarms[index].tokens
        // do whatever

        // check for account, if no account set to 0
        const userInfoPool = JSBI.BigInt(userStaked.result?.['amount'])
        const earnedRewardPool = JSBI.BigInt(rewardsPending.result?.[0])
        const totalSupplyStaked = JSBI.BigInt(stakingTotalSupplyState.result?.[0])
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState.result?.[0])

        const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))
        const earnedAmount = new TokenAmount(TRI, JSBI.BigInt(earnedRewardPool))
        const totalStakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(totalSupplyStaked))

        // tvl calculation
        // const reserveInUSDC = calculateReserveInUSDC(pair, daiUSDCPair, wnearUSDCPair, usdc, dai, wnear);
        const reserveInUSDC = tokenAmount
        // const totalStakedAmountInUSD = calculateTotalStakedAmountInUSDC(totalSupplyStaked, totalSupplyAvailable, reserveInUSDC, usdc);
        const totalStakedAmountInUSD = tokenAmount // TO REPLACE
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
        // const apr = calculateApr(totalStakedAmountInUSD, triUSDCPair, totalRewardRate)
        const apr = 9 // TO REPLACE

        memo.push({
          ID: activeFarms[index].ID,
          stakingRewardAddress: MASTERCHEF_ADDRESS[chainId],
          tokens: tokens,
          isPeriodFinished: false,
          earnedAmount: earnedAmount,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          totalStakedAmountInUSD: totalStakedAmountInUSD,
          totalStakedAmountInETH: activeFarms[index].totalStakedAmountInETH,
          allocPoint: activeFarms[index].allocPoint,
          totalRewardRate: totalRewardRate,
          rewardRate: rewardRate,
          apr: apr
        })
        return memo
      }
      return activeFarms
    }, [])
  }, [
    activeFarms,
    stakingTotalSupplies,
    // daiUSDCPair,
    // triUSDCPair,
    // wnearUSDCPair,
    pairs,
    pairTotalSupplies,
    pendingTri,
    userInfo
  ])
}

const calculateReserveInUSDC = function(
  pair: Pair,
  daiUsdcPair: Pair,
  wnearUSDCPair: Pair,
  usdc: Token,
  dai: Token,
  wnear: Token
): JSBI {
  // calculating TVL
  if (pair.token0 === usdc || pair.token1 === usdc) {
    return JSBI.multiply(pair.reserveOf(usdc).raw, JSBI.BigInt(2))
  } else if (pair.token0 === dai || pair.token1 === dai) {
    const oneToken = JSBI.BigInt(1000000000000000000)
    const reserveInDai = pair.reserveOf(dai).raw
    const daiReserveInDaiUsdcPair = daiUsdcPair.reserveOf(dai).raw
    const usdcReserveInDaiUsdcPair = daiUsdcPair.reserveOf(usdc).raw
    const usdcDaiRatio = JSBI.divide(JSBI.multiply(oneToken, usdcReserveInDaiUsdcPair), daiReserveInDaiUsdcPair)
    return JSBI.multiply(JSBI.divide(JSBI.multiply(reserveInDai, usdcDaiRatio), oneToken), JSBI.BigInt(2))
  } else if (pair.token0 === wnear || pair.token1 === wnear) {
    const oneToken = JSBI.BigInt(1000000000000000000)
    const reserveInWnear = pair.reserveOf(wnear).raw
    const wNearReserveInWNearUsdcPair = wnearUSDCPair.reserveOf(wnear).raw
    const usdcReserveInWNearUsdcPair = wnearUSDCPair.reserveOf(usdc).raw
    const usdcWNearRatio = JSBI.divide(JSBI.multiply(oneToken, usdcReserveInWNearUsdcPair), wNearReserveInWNearUsdcPair)
    return JSBI.multiply(JSBI.divide(JSBI.multiply(reserveInWnear, usdcWNearRatio), oneToken), JSBI.BigInt(2))
  } else {
    console.error('Failed to load staking rewards info')
    return JSBI.BigInt(0)
  }
}

const calculateTotalStakedAmountInUSDC = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  reserveInUSDC: JSBI,
  usdc: Token
): TokenAmount {
  if (JSBI.EQ(amountAvailable, JSBI.BigInt(0))) {
    return new TokenAmount(usdc, JSBI.BigInt(0))
  }
  return new TokenAmount(usdc, JSBI.divide(JSBI.multiply(amountStaked, reserveInUSDC), amountAvailable))
}

const calculateApr = function(
  totalStakedAmountInUSD: TokenAmount,
  triUSDCPair: Pair,
  totalRewardRate: TokenAmount
): number {
  if (JSBI.EQ(totalStakedAmountInUSD.raw, JSBI.BigInt(0))) {
    return 0
  }
  const triToUsdcRatio = triUSDCPair.priceOf(TRI)
  const totalYearlyRewards = JSBI.multiply(totalRewardRate.raw, JSBI.BigInt(3600 * 24 * 365))
  const apr = triToUsdcRatio.raw
    .multiply(totalYearlyRewards)
    .multiply('100')
    .divide(totalStakedAmountInUSD.raw)
  return Number(apr.toFixed(4))
}
