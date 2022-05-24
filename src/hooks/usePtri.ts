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
  TOTAL_ASSETS = 'totalAssets',
  USER_BALANCE = 'balanceOf',
  USER_CLAIMABLE = 'claimableRevenueAssets'
}

export function usePtriStakeInfo() {
  const { account } = useActiveWeb3React()
  const piContract = usePTriContract()
  const { getTriPrice } = useTriPrice()
  const triPrice = getTriPrice()
  const [{ virtualPrice }] = useStablePoolsData(StableSwapPoolName.USDC_USDT_USN)

  const getStakedInUsd = (stakedAmount: JSBI) => {
    const stakeCallResultInItri = new TokenAmount(TRI[ChainId.AURORA], stakedAmount.toString())
    const stakedInUsd = stakeCallResultInItri.multiply(triPrice ?? BIG_INT_ZERO).toFixed(2)
    return stakedInUsd
  }

  const totalStakedCallResult: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.TOTAL_ASSETS)?.result?.[0] ?? BIG_INT_ZERO
  const totalStakedInUsd = getStakedInUsd(totalStakedCallResult)

  const userStakedCallResult: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.USER_BALANCE, [account ?? undefined])?.result?.[0] ?? BIG_INT_ZERO
  const userStakedInUsd = getStakedInUsd(userStakedCallResult)

  const userClaimableRewards: JSBI =
    useSingleCallResult(piContract, stakeAmountCall.USER_CLAIMABLE, [account ?? undefined])?.result?.[0] ?? BIG_INT_ZERO

  const userClaimableRewardsIn3pool = new TokenAmount(
    STABLESWAP_POOLS.USDC_USDT_USN.lpToken,
    userClaimableRewards.toString()
  )
  const userClaimableRewardsInUsd = virtualPrice?.multiply(userClaimableRewardsIn3pool)

  return { totalStakedInUsd, userStakedInUsd, userClaimableRewardsInUsd }
}
