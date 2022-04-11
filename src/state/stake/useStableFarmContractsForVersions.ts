import { useCallback, useMemo } from 'react'
import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'

import { useMasterChefV2ContractForVersion } from './hooks-sushi'
import { useSingleContractMultipleData } from '../multicall/hooks'
import { usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useBlockNumber } from '../application/hooks'

import { ChefVersions, STAKING, StakingTri, StakingTriStakedAmounts } from './stake-constants'
import { StableFarm, STABLE_FARMS, StableFarmsStakedAmounts } from '../stableswap/constants'

// gets the staking info from the network for the active chain id
export function useStableFarmContractsForVersion(chefVersion: ChefVersions): StableFarmsStakedAmounts[] {
  const { chainId, account } = useActiveWeb3React()

  const activeFarms = Object.values(STABLE_FARMS[ChainId.AURORA])
  const contract = useMasterChefV2ContractForVersion(chefVersion)
  const latestBlock = useBlockNumber()

  const farmArgs = getStableFarmArgs(account, activeFarms)

  const userInfo = useSingleContractMultipleData(farmArgs ? contract : null, 'userInfo', farmArgs!) //user related

  const isLoading = userInfo?.some(({ loading }) => loading)

  const data = useMemo(() => {
    if (!chainId) {
      return activeFarms
    }

    return activeFarms.map((farm, index) => {
      // User based info
      const userStaked = userInfo[index]
      // const [_pairState, pair] = pairs[index]

      if (isLoading) {
        return {
          name: farm.name,
          stakedAmount: null
        }
      }

      // check for account, if no account set to 0
      const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)
      const stakedAmount = new TokenAmount(farm.lpToken, JSBI.BigInt(userInfoPool))

      return {
        name: farm.name,
        stakedAmount: stakedAmount
      }
    })
  }, [chainId, activeFarms, chefVersion, latestBlock, isLoading])

  return data
}

// in stable farms, we work with pool ids instead of IDS
function getStableFarmArgs(account?: string | null, farms?: StableFarm[]) {
  return !account || !farms?.length ? null : farms.map(farm => [farm.poolId, account?.toString()])
}
