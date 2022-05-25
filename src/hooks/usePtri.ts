import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'

import { useActiveWeb3React } from '.'
import { useSingleCallResult } from '../state/multicall/hooks'
import { usePTriContract } from './useContract'
import useStablePoolsData from './useStablePoolsData'
import useTriPrice from './useTriPrice'

import { BIG_INT_ZERO } from '../constants'
import { TRI } from '../constants/tokens'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'

export enum stakeAmountCall {
  TOTAL_STAKED = 'internalTRIBalance',
  USER_BALANCE = 'balanceOf',
  USER_CLAIMABLE = 'pendingReward'
}

export function usePtriStakeInfo() {
  const { account } = useActiveWeb3React()
  const piContract = usePTriContract()
  const { getTriPrice } = useTriPrice()
  const triPrice = getTriPrice()
  const [{ virtualPrice }] = useStablePoolsData(StableSwapPoolName.USDC_USDT_USN)

  const getStakedAmountsInTri = (stakedAmount: JSBI) => {
    return new TokenAmount(TRI[ChainId.AURORA], stakedAmount.toString())
  }

  const getStakedAmountInUsd = (stakedAmount: TokenAmount) => {
    return stakedAmount.multiply(triPrice ?? BIG_INT_ZERO).toFixed(2)
  }

  const totalStakedCallResult: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.TOTAL_STAKED)?.result?.[0] ?? BIG_INT_ZERO
  const totalStakedAmount = getStakedAmountsInTri(totalStakedCallResult)
  const totalStakedInUsd = getStakedAmountInUsd(totalStakedAmount)

  const userStakedCallResult: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.USER_BALANCE, [account ?? undefined])?.result?.[0] ?? BIG_INT_ZERO
  const userStaked = getStakedAmountsInTri(userStakedCallResult)
  const userStakedInUsd = getStakedAmountInUsd(userStaked)

  const userClaimableRewardsCallResult: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.USER_CLAIMABLE, [
      account ?? undefined,
      STABLESWAP_POOLS.USDC_USDT_USN.lpToken.address
    ])?.result?.[0] ?? BIG_INT_ZERO

  const userClaimableRewards = new TokenAmount(
    STABLESWAP_POOLS.USDC_USDT_USN.lpToken,
    userClaimableRewardsCallResult.toString()
  )
  const userClaimableRewardsInUsd = virtualPrice?.multiply(userClaimableRewards).toFixed(2)

  return {
    totalStakedAmount,
    totalStakedInUsd,
    userStaked,
    userStakedInUsd,
    userClaimableRewards,
    userClaimableRewardsInUsd
  }
}
