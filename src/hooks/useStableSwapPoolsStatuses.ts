import { useMemo } from 'react'

import SWAP_FLASH_LOAN_ABI from '../constants/abis/stableswap/swapFlashLoan.json'
import LPTOKEN_UNGUARDED_ABI from '../constants/abis/stableswap/lpTokenUnguarded.json'
import { useActiveWeb3React } from '.'
import { StableSwapPoolName, StableSwapPoolTypes, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { Interface } from '@ethersproject/abi'
import { ChainId, JSBI, WETH } from '@trisolaris/sdk'
import { BIG_INT_ZERO } from '../constants'
import { WBTC } from '../constants/tokens'
import useUSDCPrice from './useUSDCPrice'

type StableSwapPoolStatuses = {
  [poolName in StableSwapPoolName]?: {
    tvl: JSBI
    isPaused: boolean
  }
}

export default function useStableSwapPoolsStatuses(): StableSwapPoolStatuses {
  const { chainId = ChainId.AURORA } = useActiveWeb3React()

  const stableSwapPools = useMemo(
    () => Object.values(STABLESWAP_POOLS[ChainId.AURORA]).filter(({ address }) => address),
    []
  )

  const stableSwapPoolLPTokens: string[] = chainId == null ? [] : stableSwapPools.map(({ lpToken }) => lpToken.address)
  const swapAddresses: string[] = chainId == null ? [] : stableSwapPools.map(({ address }) => address)

  const FALLBACK_TVL = BIG_INT_ZERO
  const tvls = useMultipleContractSingleData(
    stableSwapPoolLPTokens,
    new Interface(LPTOKEN_UNGUARDED_ABI),
    'totalSupply'
  )?.map(({ result }) => result?.[0] ?? FALLBACK_TVL)

  const FALLBACK_PAUSE_STATUS = true // Show pools as paused if they're still loading
  const pausedStatuses = useMultipleContractSingleData(
    swapAddresses,
    new Interface(SWAP_FLASH_LOAN_ABI),
    'paused'
  )?.map(({ result }) => result?.[0] ?? FALLBACK_PAUSE_STATUS)

  const btcPrice = useUSDCPrice(WBTC[chainId ?? ChainId.AURORA])
  const ethPrice = useUSDCPrice(WETH[chainId ?? ChainId.AURORA])

  const tvlsUSD = useMemo(() => {
    return stableSwapPools.map((pool, i) => {
      const tvlAmount = tvls[i]
      let tokenValue = 0

      switch (pool.type) {
        case StableSwapPoolTypes.BTC:
          tokenValue = JSBI.toNumber(JSBI.BigInt(btcPrice ?? 0))
          break
        case StableSwapPoolTypes.ETH:
          tokenValue = JSBI.toNumber(JSBI.BigInt(ethPrice ?? 0))
          break
        default:
          tokenValue = 1 // USD
      }

      return JSBI.divide(
        JSBI.multiply(JSBI.BigInt(tokenValue), JSBI.BigInt(tvlAmount)),
        JSBI.exponentiate(JSBI.BigInt('10'), JSBI.BigInt('2')) // 1e18
      )
    })
  }, [btcPrice, ethPrice, stableSwapPools, tvls])

  return useMemo(
    () =>
      stableSwapPools.reduce((acc, pool, i) => {
        acc[pool.name] = { tvl: tvlsUSD[i], isPaused: pausedStatuses[i] }

        return acc
      }, {} as StableSwapPoolStatuses),
    [pausedStatuses, stableSwapPools, tvlsUSD]
  )
}
