import React, { useCallback, useMemo } from 'react'
import { Token, ChainId, TokenAmount, JSBI } from '@trisolaris/sdk'
import _ from 'lodash'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { CallState, useSingleCallResult } from '../multicall/hooks'
import { useComplexNRewarderContract } from './hooks-sushi'
import { ChefVersions, EarnedNonTriRewards, STAKING } from './stake-constants'

export default function useGetNonTriRewardsForPoolID(
  version: number
): Pick<CallState, 'error' | 'loading'> & { result: EarnedNonTriRewards[] } {
  const { chainId, account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
  const { chefVersion, poolId, rewarderAddress } = activeFarms[version]
  const complexNRewarderContract = useComplexNRewarderContract(rewarderAddress)

  const getTokenByAddress = useCallback(
    address =>
      _.find(allTokens, token => token.address.toLowerCase() === address.toLowerCase()) ??
      new Token(ChainId.AURORA, address, 18),
    [allTokens]
  )

  const { error, loading, result } = useSingleCallResult(
    chefVersion === ChefVersions.V2 ? complexNRewarderContract : null,
    'pendingTokens',
    [poolId.toString(), account?.toString(), '0']
  )

  const earnedNonTriRewards = useMemo(() => {
    if (result == null) {
      return []
    }

    const { rewardAmounts = [], rewardTokens = [] } = result
    return rewardTokens.map((rewardTokenAddress: string, i: number) => {
      const token = getTokenByAddress(rewardTokenAddress)
      return {
        token,
        amount: new TokenAmount(token, JSBI.BigInt(rewardAmounts[i] ?? 0))
      }
    })
  }, [getTokenByAddress, result])

  return { error, loading, result: earnedNonTriRewards }
}
