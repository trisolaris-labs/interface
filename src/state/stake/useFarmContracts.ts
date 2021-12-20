import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { useMasterChefContract, useMasterChefV2Contract } from './hooks-sushi'
import { ChefVersions, STAKING, StakingTri, StakingTriStakedAmounts } from './stake-constants'
import { useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useCallback, useMemo } from 'react'
import { usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useFarmContractsForVersion } from './useFarmContractsForVersion'

// gets the staking info from the network for the active chain id
export function useFarmsContracts(): StakingTriStakedAmounts[] {
    const dataV1 = useFarmContractsForVersion(ChefVersions.V1);
    const dataV2 = useFarmContractsForVersion(ChefVersions.V2);

    return dataV1.concat(dataV2);
}