import { ChainId, JSBI, Percent, TokenAmount } from '@trisolaris/sdk'

import { useActiveWeb3React } from '.'
import { useSingleCallResult } from '../state/multicall/hooks'
import { usePTriContract } from './useContract'
import useStablePoolsData from './useStablePoolsData'
import useTriPrice from './useTriPrice'

import { BIG_INT_ZERO } from '../constants'
import { PTRI } from '../constants/tokens'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useTotalSupply } from '../data/TotalSupply'
import { useTokenBalance } from '../state/wallet/hooks'

export enum stakeAmountCall {
  DEPOSIT_FEE = 'depositFeePercent',
  TOTAL_STAKED = 'internalTRIBalance',
  USER_BALANCE = 'balanceOf',
  USER_CLAIMABLE = 'pendingReward'
}

const NULL_PTRI_AMOUNT = new TokenAmount(PTRI[ChainId.AURORA], BIG_INT_ZERO)

export function usePtriStakeInfo() {
  const { account } = useActiveWeb3React()
  const ptriContract = usePTriContract()
  const { getTriPrice } = useTriPrice()
  const triPrice = getTriPrice()
  const [{ virtualPrice }] = useStablePoolsData(StableSwapPoolName.USDC_USDT_USN)

  const totalStaked = useTotalSupply(PTRI[ChainId.AURORA]) ?? NULL_PTRI_AMOUNT
  const totalStakedInUsd = totalStaked.multiply(triPrice ?? BIG_INT_ZERO).toFixed(2)
  const userStaked = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA]) ?? NULL_PTRI_AMOUNT
  const userStakedPercentage = totalStaked.equalTo(BIG_INT_ZERO)
    ? new Percent('0')
    : new Percent(userStaked.raw, totalStaked.raw)
  const userStakedInUsd = userStaked.multiply(triPrice ?? BIG_INT_ZERO).toFixed(2)

  const userClaimableRewardsCallResult: JSBI =
    useSingleCallResult(ptriContract, stakeAmountCall.USER_CLAIMABLE, [
      account ?? undefined,
      STABLESWAP_POOLS.USDC_USDT_USN.lpToken.address
    ])?.result?.[0] ?? BIG_INT_ZERO

  const userClaimableRewards = new TokenAmount(
    STABLESWAP_POOLS.USDC_USDT_USN.lpToken,
    userClaimableRewardsCallResult.toString()
  )
  const userClaimableRewardsInUsd = virtualPrice?.multiply(userClaimableRewards).toFixed(2)
  const depositFee = JSBI.BigInt(
    useSingleCallResult(ptriContract, stakeAmountCall.DEPOSIT_FEE)?.result?.[0] ?? BIG_INT_ZERO
  )
  const depositFeePercent = new Percent(depositFee, (1e18).toString())

  return {
    depositFee,
    depositFeePercent: depositFeePercent.greaterThan(BIG_INT_ZERO) ? depositFeePercent : null,
    totalStaked,
    totalStakedInUsd,
    userStaked,
    userStakedPercentage,
    userStakedInUsd,
    userClaimableRewards,
    userClaimableRewardsInUsd
  }
}
