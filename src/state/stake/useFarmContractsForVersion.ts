import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { useMasterChefV2ContractForVersion } from './hooks-sushi'
import { ChefVersions, STAKING, StakingTri, StakingTriStakedAmounts } from './stake-constants'
import { useSingleContractMultipleData } from '../multicall/hooks'
import { useCallback, useMemo } from 'react'
import { usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useBlockNumber } from '../application/hooks'

// gets the staking info from the network for the active chain id
export function useFarmContractsForVersion(chefVersion: ChefVersions): StakingTriStakedAmounts[] {
  const { chainId, account } = useActiveWeb3React()

  const activeFarms = STAKING[chainId ?? ChainId.AURORA]
    // Ignore all stable farms
    .filter(({ stableSwapPoolName }) => stableSwapPoolName == null)
  const contract = useMasterChefV2ContractForVersion(chefVersion)
  const latestBlock = useBlockNumber()

  const lpAddresses = getLPAddresses(activeFarms, chefVersion)
  const lpAddressesArgs = getArgs(account, lpAddresses)

  const userInfo = useSingleContractMultipleData(lpAddressesArgs ? contract : null, 'userInfo', lpAddressesArgs!) //user related

  const isLoading = userInfo?.some(({ loading }) => loading)

  // get all the info from the staking rewards contracts
  const tokens = activeFarms.filter(v => v.chefVersion === chefVersion).map(({ tokens }) => tokens)
  const pairs = usePairs(tokens)

  const getActiveFarmID = useCallback(
    (lpAddress: string) => {
      const farm = activeFarms.find(farm => farm.lpAddress === lpAddress && farm.chefVersion === chefVersion)

      return farm!.ID
    },
    [activeFarms, chefVersion]
  )

  const data = useMemo(() => {
    if (!chainId || !lpAddresses) {
      return activeFarms
    }

    return lpAddresses.map((lpAddress, index) => {
      // User based info
      const userStaked = userInfo[index]
      const activeFarmID = getActiveFarmID(lpAddress)
      const [_pairState, pair] = pairs[index]

      if (isLoading || pair == null) {
        return {
          ID: activeFarmID,
          stakedAmount: null
        }
      }

      // check for account, if no account set to 0
      const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)
      const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))

      return {
        ID: activeFarmID,
        stakedAmount: stakedAmount
      }
    })
  }, [chainId, lpAddresses, chefVersion, latestBlock, isLoading])

  return data
}

function getLPAddresses(activeFarms: StakingTri[], chefVersion: ChefVersions) {
  return activeFarms.filter(key => key.chefVersion === chefVersion).map(key => key.lpAddress)
}

function getArgs(account?: string | null, addresses?: string[]) {
  return !account || !addresses ? null : addresses.map((_, i) => [i.toString(), account?.toString()])
}
