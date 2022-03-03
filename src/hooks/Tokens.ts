import { parseBytes32String } from '@ethersproject/strings'
import { Currency, CETH, Token, currencyEquals, ChainId } from '@trisolaris/sdk'
import _ from 'lodash'
import { useMemo } from 'react'
import { useSelectedTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { Field } from '../state/stableswap/actions'
import { STABLESWAP_POOLS, STABLE_SWAP_TYPES } from '../state/stableswap/constants'
import { useDerivedStableSwapInfo } from '../state/stableswap/hooks'
import { useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'
import { wrappedCurrency } from '../utils/wrappedCurrency'

import { useActiveWeb3React } from './index'
import { useCalculateStableSwapPairs } from './useCalculateStableSwapPairs'
import { useBytes32TokenContract, useTokenContract } from './useContract'

type TokensMap = { [address: string]: Token }

export function useAllTokens(): TokensMap {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<TokensMap>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// Returns map of all tokens that are part of stable swap LP pools
export function useAllStableSwapTokens(): TokensMap {
  const { chainId } = useActiveWeb3React()
  const allTokens = useSelectedTokenList()

  return useMemo(() => {
    if (!chainId) {
      return {}
    }

    const validStablesSet = _.transform(
      STABLESWAP_POOLS,
      (acc, pool) => {
        pool.poolTokens.forEach(token => acc.add(token.address))
        return acc
      },
      new Set()
    )
    const validStableTokens = _.filter(allTokens[chainId], token => validStablesSet.has(token.address))

    return validStableTokens
  }, [chainId, allTokens])
}

// When an input stable token is selected, returns a list of all valid output stables
// When multiple pools for the same token are available, the highest TVL pool is chosen
export function useAllValidStableSwapOutputTokens(): TokensMap {
  const { chainId } = useActiveWeb3React()
  const allTokens = useSelectedTokenList()
  const calculateStableSwapPairs = useCalculateStableSwapPairs()
  const { currencies } = useDerivedStableSwapInfo()

  return useMemo(() => {
    if (!chainId) {
      return {}
    }

    const inputToken = wrappedCurrency(currencies[Field.INPUT], chainId)
    const outputTokens = calculateStableSwapPairs(inputToken)
    const outputTokensSet = new Set(
      outputTokens.filter(item => item.type !== STABLE_SWAP_TYPES.INVALID).map(token => token.to.address)
    )

    const validStableTokens = _.filter(allTokens[chainId], token => outputTokensSet.has(token.address))

    return validStableTokens
  }, [chainId, currencies, calculateStableSwapPairs, allTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isAVAX = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(isAVAX ? undefined : currencyId)
  return isAVAX ? CETH : token
}
