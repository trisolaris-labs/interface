import { useEffect, useMemo, useState } from 'react'

import SWAP_FLASH_LOAN_ABI from '../constants/abis/stableswap/swapFlashLoan.json'
import LPTOKEN_UNGUARDED_ABI from '../constants/abis/stableswap/lpTokenUnguarded.json'
import { useActiveWeb3React } from '.'
import { StableSwapPoolName, StableSwapPoolTypes, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { Interface } from '@ethersproject/abi'
import { JSBI } from '@trisolaris/sdk'

type StableSwapPoolStatuses = {
  [poolName in StableSwapPoolName]?: {
    tvl: JSBI
    isPaused: boolean
  }
}

// @nocommit Temporary shim for `tokenPricesUSD`
const tokenPricesUSD = {
  BTC: 39161.26,
  ETH: 2785.34,
  WETH: 2785.34,
  VETH2: 1132.4079685542372,
  KEEP: 0.621089,
  ALCX: 130.67,
  USDC: 1.003,
  alUSD: 0.997912,
  FEI: 0.999411,
  LUSD: 1.012,
  alETH: 2785.34
}
export default function useStableSwapPoolsStatuses(): StableSwapPoolStatuses {
  const { chainId } = useActiveWeb3React()

  const stableSwapPools = useMemo(
    () => Object.values(STABLESWAP_POOLS).filter(({ addresses }) => (chainId != null ? addresses[chainId] : null)),
    [chainId]
  )

  const stableSwapPoolLPTokens: string[] = chainId == null ? [] : stableSwapPools.map(({ lpToken }) => lpToken[chainId])
  const swapAddresses: string[] =
    chainId == null
      ? []
      : stableSwapPools.map(({ metaSwapAddresses, addresses }) => metaSwapAddresses?.[chainId] ?? addresses?.[chainId])

  const tvls = useMultipleContractSingleData(
    stableSwapPoolLPTokens,
    new Interface(LPTOKEN_UNGUARDED_ABI),
    'totalSupply'
  )?.map(({ result: amount }) => JSBI.BigInt(amount ?? '0'))

  // const pausedStatuses = [false]
  const pausedStatuses = useMultipleContractSingleData(
    swapAddresses,
    new Interface(SWAP_FLASH_LOAN_ABI),
    'paused'
  )?.map(({ result: isPaused }) => Boolean(isPaused ?? false))

  const tvlsUSD = useMemo(() => {
    return stableSwapPools.map((pool, i) => {
      const tvlAmount = tvls[i]
      let tokenValue = 0

      switch (pool.type) {
        case StableSwapPoolTypes.BTC:
          tokenValue = tokenPricesUSD?.BTC ?? 0
          break
        case StableSwapPoolTypes.ETH:
          tokenValue = tokenPricesUSD?.ETH ?? 0
          break
        default:
          tokenValue = 1 // USD
      }

      return JSBI.divide(
        JSBI.multiply(JSBI.BigInt(tokenValue), JSBI.BigInt(tvlAmount)),
        JSBI.exponentiate(JSBI.BigInt('10'), JSBI.BigInt('2')) // 1e18
      )
    })
  }, [stableSwapPools, tvls])

  return useMemo(
    () =>
      stableSwapPools.reduce((acc, pool, i) => {
        acc[pool.name] = { tvl: tvlsUSD[i], isPaused: pausedStatuses[i] }

        return acc
      }, {} as StableSwapPoolStatuses),
    [pausedStatuses, stableSwapPools, tvlsUSD]
  )
}
