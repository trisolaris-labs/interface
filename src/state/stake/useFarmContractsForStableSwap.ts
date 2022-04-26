import { ChainId, JSBI, Token, TokenAmount } from '@trisolaris/sdk'
import { useMasterChefV2ContractForVersion } from './hooks-sushi'
import { ChefVersions, STAKING, StakingTriStakedAmounts } from './stake-constants'
import { useSingleContractMultipleData } from '../multicall/hooks'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useBlockNumber } from '../application/hooks'
import { STABLESWAP_POOLS } from '../stableswap/constants'

// gets the staking info from the network for the active chain id
export function useFarmContractsForStableSwap(): StakingTriStakedAmounts[] {
  const { chainId, account } = useActiveWeb3React()
  const contract = useMasterChefV2ContractForVersion(ChefVersions.V2)
  useBlockNumber()

  const activeFarms = STAKING[chainId ?? ChainId.AURORA]

  // Only operate on stable farms
  const activeStablePoolFarms = activeFarms.filter(
    ({ chefVersion, stableSwapPoolName }) => chefVersion === ChefVersions.V2 && stableSwapPoolName != null
  )
  const activeStablePoolFarmData = activeStablePoolFarms.map(({ ID, stableSwapPoolName }) => ({
    ID,
    lpToken: stableSwapPoolName != null ? STABLESWAP_POOLS[stableSwapPoolName].lpToken : null
  }))

  const lpTokens = activeStablePoolFarmData.map(({ lpToken }) => lpToken)
  const lpAddressesArgs = getArgs(account ?? null, lpTokens)

  const userInfo = useSingleContractMultipleData(
    lpAddressesArgs.length > 0 ? contract : null,
    'userInfo',
    lpAddressesArgs
  ) //user related

  const isLoading = userInfo?.some(({ loading }) => loading)

  const data = useMemo(() => {
    if (!chainId) {
      return activeStablePoolFarms
    }

    return activeStablePoolFarmData.map(({ ID, lpToken }, index) => {
      // User based info
      const userStaked = userInfo[index]
      if (isLoading || lpToken == null) {
        return {
          ID,
          stakedAmount: null
        }
      }

      // check for account, if no account set to 0
      const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)
      const stakedAmount = new TokenAmount(lpToken, JSBI.BigInt(userInfoPool))

      return {
        ID,
        stakedAmount: stakedAmount
      }
    })
  }, [chainId, activeStablePoolFarmData, activeStablePoolFarms, userInfo, isLoading])

  return data
}

function getArgs(account: string | null, addresses: (Token | null)[]) {
  return !account ? [] : addresses.map((_, i) => [i.toString(), account?.toString()])
}
