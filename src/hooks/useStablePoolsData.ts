import { AddressZero } from '@ethersproject/constants'

import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from '.'
import { getTokenForStablePoolType, StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useStableSwapContract } from './useContract'
import { ChainId, Fraction, JSBI, Percent, Price, Token, TokenAmount } from '@trisolaris/sdk'
import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useTokenBalance } from '../state/wallet/hooks'
import { useTotalSupply } from '../data/TotalSupply'
import { BIG_INT_ZERO } from '../constants'
import { USDC } from '../constants/tokens'

interface TokenShareType {
  percent: Percent
  token: Token
  value: TokenAmount
}

export type Partners = 'keep' | 'sharedStake' | 'alchemix'
export interface StablePoolDataType {
  adminFee: Percent
  aParameter: JSBI
  name: string
  reserve: TokenAmount | null
  swapFee: Percent
  tokens: TokenShareType[]
  totalLocked: TokenAmount | null
  virtualPrice: Fraction | null
  isPaused: boolean
  lpTokenPriceUSD: Price
  lpToken: Token | null
}

export interface UserShareType {
  lpTokenBalance: TokenAmount
  name: StableSwapPoolName // TODO: does this need to be on user share?
  share: Percent
  tokens: TokenShareType[]
  usdBalance: TokenAmount
  // underlyingTokensAmount: JSBI
  amountsStaked: Partial<Record<Partners, BigNumber>>
}

export type PoolDataHookReturnType = [StablePoolDataType, UserShareType | null]

export default function usePoolData(poolName: StableSwapPoolName): PoolDataHookReturnType {
  const { account } = useActiveWeb3React()

  const pool = STABLESWAP_POOLS[ChainId.AURORA][poolName]
  const { lpToken, metaSwapAddresses } = pool
  const effectivePoolTokens =
    pool?.underlyingPoolTokens != null && pool.underlyingPoolTokens.length > 0
      ? pool.underlyingPoolTokens
      : pool.poolTokens
  const isMetaSwap = metaSwapAddresses != null

  const swapContract = useStableSwapContract(poolName)

  const swapStorage = useSingleCallResult(swapContract, 'swapStorage')
  const [adminFee, swapFee] = [
    swapStorage?.result?.adminFee ?? BIG_INT_ZERO,
    swapStorage?.result?.swapFee ?? BIG_INT_ZERO
  ].map(value => new Percent(value, JSBI.BigInt(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(12)))))
  const rawVirtualPrice = useSingleCallResult(swapContract, 'getVirtualPrice')?.result?.[0] ?? BIG_INT_ZERO
  const virtualPrice = JSBI.equal(BIG_INT_ZERO, JSBI.BigInt(rawVirtualPrice))
    ? null
    : new Fraction(JSBI.BigInt(rawVirtualPrice), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)))
  const aParameter: JSBI = useSingleCallResult(swapContract, 'getA')?.result?.[0] ?? BIG_INT_ZERO
  const isPaused: boolean = useSingleCallResult(swapContract, 'paused')?.result?.[0] ?? false
  const userLPTokenBalance = useTokenBalance(account ?? AddressZero, lpToken) ?? new TokenAmount(lpToken, BIG_INT_ZERO)
  const totalLpTokenBalance = useTotalSupply(lpToken) ?? new TokenAmount(lpToken, BIG_INT_ZERO)

  // Pool token data
  const tokenBalanceInputs: number[][] = (effectivePoolTokens ?? []).map((_, i) => [i])
  const tokenBalances = useSingleContractMultipleData(swapContract, 'getTokenBalance', tokenBalanceInputs)
    ?.map(response => response?.result)
    ?.flat()
    ?.map((item: any) => JSBI.BigInt(item ?? BIG_INT_ZERO))

  const tokenBalancesSum = sumAllJSBI(tokenBalances)

  const poolPresentationTokenDecimals = getTokenForStablePoolType(pool.type).decimals
  const STABLE_POOL_CONTRACT_DECIMALS = 18
  const decimalDelta = JSBI.exponentiate(
    JSBI.BigInt(10),
    JSBI.BigInt(Math.abs(poolPresentationTokenDecimals - STABLE_POOL_CONTRACT_DECIMALS))
  )
  const presentationTokenHasMoreDecimals = poolPresentationTokenDecimals > STABLE_POOL_CONTRACT_DECIMALS
  const presentationTokenHasLessDecimals = poolPresentationTokenDecimals < STABLE_POOL_CONTRACT_DECIMALS

  const tokenBalancesUSD = effectivePoolTokens.map((token, i, arr) => {
    // use another token to estimate USD price of meta LP tokens
    const effectiveToken = isMetaSwap && i === arr.length - 1 ? getTokenForStablePoolType(pool.type) : token
    const balance = tokenBalances[i]
    const tokenAmount = new TokenAmount(effectiveToken, balance)

    if (token.decimals > STABLE_POOL_CONTRACT_DECIMALS) {
      return JSBI.divide(tokenAmount.raw, decimalDelta)
    } else if (token.decimals < STABLE_POOL_CONTRACT_DECIMALS) {
      return JSBI.multiply(tokenAmount.raw, decimalDelta)
    } else {
      return tokenAmount.raw
    }
  })

  const tokenBalancesUSDSum = presentationTokenHasMoreDecimals
    ? JSBI.multiply(
        tokenBalancesUSD.reduce((acc, item) => JSBI.add(acc, item), BIG_INT_ZERO),
        decimalDelta
      )
    : presentationTokenHasLessDecimals
    ? JSBI.divide(
        tokenBalancesUSD.reduce((acc, item) => JSBI.add(acc, item), BIG_INT_ZERO),
        decimalDelta
      )
    : tokenBalancesUSD.reduce((acc, item) => JSBI.add(acc, item), BIG_INT_ZERO)

  const lpTokenPriceUSD = JSBI.equal(tokenBalancesSum, BIG_INT_ZERO)
    ? new Price(USDC[ChainId.AURORA], lpToken, '1', BIG_INT_ZERO)
    : new Price(
        USDC[ChainId.AURORA],
        lpToken,
        tokenBalancesUSD.reduce((acc, item) => JSBI.add(acc, item), BIG_INT_ZERO),
        presentationTokenHasMoreDecimals
          ? JSBI.divide(tokenBalancesSum, decimalDelta)
          : presentationTokenHasLessDecimals
          ? JSBI.multiply(tokenBalancesSum, decimalDelta)
          : tokenBalancesSum
      )

  const poolTokens = effectivePoolTokens.map((token, i) => ({
    token,
    percent: new Percent(
      tokenBalances[i],
      JSBI.equal(tokenBalancesSum, BIG_INT_ZERO) ? JSBI.BigInt(1) : tokenBalancesSum
    ),
    value: new TokenAmount(token, tokenBalances[i])
  }))

  const poolData = {
    name: poolName,
    tokens: poolTokens,
    reserve: new TokenAmount(getTokenForStablePoolType(pool.type), tokenBalancesUSDSum),
    totalLocked: totalLpTokenBalance,
    virtualPrice: virtualPrice,
    adminFee: adminFee,
    swapFee: swapFee,
    aParameter: aParameter,
    lpTokenPriceUSD,
    lpToken,
    isPaused
  }

  // User Data
  const userShare = calculatePctOfTotalShare(userLPTokenBalance, totalLpTokenBalance)
  const userPoolTokenBalances = tokenBalances.map(balance => userShare.multiply(balance).quotient)

  const userPoolTokenBalancesUSD = tokenBalancesUSD.map(balance => userShare.multiply(balance).quotient)
  const userPoolTokenBalancesUSDSum = new TokenAmount(
    USDC[ChainId.AURORA],
    JSBI.divide(sumAllJSBI(userPoolTokenBalancesUSD), decimalDelta)
  )

  const userPoolTokens = effectivePoolTokens.map((token, i) => ({
    token,
    percent: new Percent(
      userPoolTokenBalances[i],
      JSBI.equal(tokenBalancesSum, BIG_INT_ZERO) ? JSBI.BigInt(1) : tokenBalancesSum
    ),
    value: new TokenAmount(token, userPoolTokenBalances[i])
  }))

  const userData = account
    ? {
        name: poolName,
        share: userShare,
        usdBalance: userPoolTokenBalancesUSDSum,
        tokens: userPoolTokens,
        lpTokenBalance: userLPTokenBalance,
        amountsStaked: {}
      }
    : null

  return [poolData, userData]
}

function calculatePctOfTotalShare(lpTokenAmount: TokenAmount, totalLpTokenBalance: TokenAmount): Percent {
  // returns the % of total lpTokens
  return new Percent(
    lpTokenAmount.raw,
    JSBI.equal(totalLpTokenBalance.raw, BIG_INT_ZERO) ? JSBI.BigInt(1) : totalLpTokenBalance.raw
  )
}

function sumAllJSBI(items: JSBI[], startValue: JSBI = BIG_INT_ZERO): JSBI {
  return items.reduce((acc, item) => JSBI.ADD(JSBI.BigInt(item), acc), startValue)
}
