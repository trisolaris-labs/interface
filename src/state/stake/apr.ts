import { ChainId } from '@trisolaris/sdk'
import { useTokenContract } from '../../hooks/useContract'
import { useMasterChefContract } from './hooks-sushi'
import { STAKING } from './stake-constants'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { Contract } from '@ethersproject/contracts'


export function useFarms(chainId = undefined) {
    // APR
    // TVL
    // Name of pools
    // Price
    const s = STAKING[ChainId.POLYGON]
    const chefContract = useMasterChefContract()
  
    const totalAllocPoints = useSingleCallResult(chefContract, 'totalAllocPoint', undefined, NEVER_RELOAD)?.result?.[0]
    var tokens: {[key: string]: Contract | null};
  
    const rewardTokenAddress = useSingleCallResult(chefContract, 'tri', undefined, NEVER_RELOAD)?.result?.[0]
    
    const rewardTokenContract = useTokenContract(rewardTokenAddress);
    
    const rewardsPerSecond = useSingleCallResult(chefContract, 'triPerBlock', undefined, NEVER_RELOAD)?.result?.[0]
    const tokenDecimals = useSingleCallResult(rewardTokenContract, 'decimals', undefined, NEVER_RELOAD)?.result?.[0]
    const rewardsPerWeek =  rewardsPerSecond / 10 ** tokenDecimals * 3600 * 24 * 7;
    return { s };
    /*
    const pools = useMemo(() => {
      if (!poolCount) {
        return
      }
      return [...Array(poolCount.toNumber()).keys()].map(pid => [String(pid)])
    }, [poolCount])
  
    const poolInfos = useSingleContractMultipleData(pools ? chefContract : null, 'poolInfo', pools!);
    const pairAddresses = useMemo(() => {
      if (!poolInfos) {
        return
      }
      return [...Array(poolCount.toNumber()).keys()].map(pid => [String(pid)])
    }, [poolCount])
    */
    
  
  
  
    // var tokenAddresses = [].concat.apply([], poolInfos.map(x => x?.result?.poolToken.tokens))
    // console.log(tokenAddresses)
    // tokenAddresses.map(async (address) => {tokens[address] = useTokenContract(address)});
  
    /*
    var prices = await lookUpTokenPrices(tokenAddresses);
    if (extraPrices) {
      for (const [k,v] of Object.entries(extraPrices)) {
        if (v.usd) {
          prices[k] = v
        }
      }
    }
    //prices["0x194ebd173f6cdace046c53eacce9b953f28411d1"] = { usd : 1.22 } //"temporary" solution
    */
  
  /*
    const poolPrices = poolInfos.map(poolInfo => poolInfo?.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken) : undefined);
  
    _print("Finished reading smart contracts.\n");
  
    let aprs = []
    for (let i = 0; i < poolCount; i++) {
      if (poolPrices[i]) {
        const apr = printChefPool(App, chefAbi, chefAddress, prices, tokens, poolInfos[i], i, poolPrices[i],
          totalAllocPoints, rewardsPerWeek, rewardTokenTicker, rewardTokenAddress,
          pendingRewardsFunction)
        aprs.push(apr);
      }
    }
    let totalUserStaked=0, totalStaked=0, averageApr=0;
    for (const a of aprs) {
      if (a && !isNaN(a.totalStakedUsd)) {
        totalStaked += a.totalStakedUsd;
      }
      if (a && a.userStakedUsd > 0) {
        totalUserStaked += a.userStakedUsd;
        averageApr += a.userStakedUsd * a.yearlyAPR / 100;
      }
    }
    averageApr = averageApr / totalUserStaked;
    _print_bold(`Total Staked: $${formatMoney(totalStaked)}`);
    if (totalUserStaked > 0) {
      _print_bold(`\nYou are staking a total of $${formatMoney(totalUserStaked)} at an average APR of ${(averageApr * 100).toFixed(2)}%`)
      _print(`Estimated earnings:`
          + ` Day $${formatMoney(totalUserStaked*averageApr/365)}`
          + ` Week $${formatMoney(totalUserStaked*averageApr/52)}`
          + ` Year $${formatMoney(totalUserStaked*averageApr)}\n`);
    }
    return { prices, totalUserStaked, totalStaked, averageApr }
  
  */
  }