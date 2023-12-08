import { Contract } from '@ethersproject/contracts'
import { ChainId, Token, WETH } from '@trisolaris/sdk'
import IUniswapV2Pair_ABI from '../constants/abis/polygon/IUniswapV2Pair.json'
import { useMemo } from 'react'

import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import STABLE_SWAP_META_SWAP_DEPOSIT_ABI from '../constants/abis/stableswap/metaSwapDeposit.json'
import STABLE_META_SWAP_ABI from '../constants/abis/stableswap/metaSwap.json'
import STABLE_SWAP_FLASH_LOAN_NO_WITHDRAW_FEE_ABI from '../constants/abis/stableswap/swapFlashLoan.json'
import STABLE_SWAP_LP_TOKEN_UNGUARDED_ABI from '../constants/abis/stableswap/lpToken.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import BRIDGE_TOKEN_ABI from '../constants/abis/bridge-token.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import WETH_ABI from '../constants/abis/polygon/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { PTRI, TRI, USDC_E, WNEAR } from '../constants/tokens'
import { STAKING } from '../state/stake/stake-constants'
import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import PTRI_ABI from '../constants/abis/pTri/ptri.json'
import AUERC20 from '../constants/abis/stableswap/auErc20.json'
import { NETWORK_CHAIN_ID } from '../connectors'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { provider, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !provider) return null
    try {
      return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined, chainId)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, address, ABI, provider, withSignerIfPossible, account])
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBridgeTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, BRIDGE_TOKEN_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const chainId = NETWORK_CHAIN_ID
  return useContract(chainId ? WETH[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2Pair_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const chainId = NETWORK_CHAIN_ID
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useUSDC_EWNEARPoolContract(): Contract | null {
  const contractAddress = findPoolContract(WNEAR[ChainId.AURORA], USDC_E[ChainId.AURORA])?.lpAddress
  return useContract(contractAddress, IUniswapV2Pair_ABI)
}

export function useTRIWNEARPoolContract(): Contract | null {
  const contractAddress = findPoolContract(WNEAR[ChainId.AURORA], TRI[ChainId.AURORA])?.lpAddress
  return useContract(contractAddress, IUniswapV2Pair_ABI)
}

function findPoolContract(tokenA: Token, tokenB: Token) {
  const pools = STAKING[ChainId.AURORA]

  return pools.find(pool => {
    const [poolTokenA, poolTokenB] = pool.tokens
    const hasTokenA = [poolTokenA.address, poolTokenB.address].includes(tokenA.address)
    const hasTokenB = [poolTokenA.address, poolTokenB.address].includes(tokenB.address)

    return hasTokenA && hasTokenB
  })
}

function useStableSwapMetaPoolDeposit(address?: string, withSignerIfPossible = true): Contract | null {
  return useContract(address, STABLE_SWAP_META_SWAP_DEPOSIT_ABI, withSignerIfPossible)
}

export function useStableSwapPool(address?: string, withSignerIfPossible = true): Contract | null {
  return useContract(address, STABLE_SWAP_FLASH_LOAN_NO_WITHDRAW_FEE_ABI, withSignerIfPossible)
}

export function useStableSwapContract(
  poolName?: StableSwapPoolName,
  withSignerIfPossible = true,
  shouldUseUnwrappedTokens = false
): Contract | null {
  const { provider } = useActiveWeb3React()
  const chainId = NETWORK_CHAIN_ID
  const pool = poolName == null ? null : STABLESWAP_POOLS[poolName]
  const metaPool = useStableSwapMetaPoolDeposit(pool?.address, withSignerIfPossible)
  const metaPoolUnwrappedTokens = useStableSwapMetaPoolDeposit(pool?.metaSwapAddresses, withSignerIfPossible)
  const stableSwapPool = useStableSwapPool(pool?.address, withSignerIfPossible)
  return useMemo(() => {
    if (!pool || !provider || !chainId) {
      return null
    }

    if (pool?.address == null) {
      return null
    }

    if (isMetaPool(pool.name)) {
      return shouldUseUnwrappedTokens ? metaPoolUnwrappedTokens : metaPool
    }

    return stableSwapPool
  }, [pool, provider, chainId, stableSwapPool, shouldUseUnwrappedTokens, metaPoolUnwrappedTokens, metaPool])
}

export function useStableSwapLPTokenContract(
  poolName: StableSwapPoolName,
  withSignerIfPossible = true
): Contract | null {
  const { lpToken } = STABLESWAP_POOLS[poolName]

  return useContract(lpToken.address, STABLE_SWAP_LP_TOKEN_UNGUARDED_ABI, withSignerIfPossible)
}

export function useStableSwapMetaPool(address?: string, withSignerIfPossible = true): Contract | null {
  return useContract(address, STABLE_META_SWAP_ABI, withSignerIfPossible)
}

export function usePTriContract(withSignerIfPossible = true): Contract | null {
  const { provider } = useActiveWeb3React()
  const chainId = NETWORK_CHAIN_ID
  const pTriContract = useContract(PTRI[ChainId.AURORA].address, PTRI_ABI, withSignerIfPossible)

  return useMemo(() => {
    if (!provider || !chainId) {
      return null
    }

    return pTriContract
  }, [provider, chainId])
}

export function useAuTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, AUERC20, withSignerIfPossible)
}
