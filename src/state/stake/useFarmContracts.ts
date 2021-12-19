import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { useMasterChefContract, useMasterChefV2Contract } from './hooks-sushi'
import { STAKING, StakingTri, StakingTriStakedAmounts } from './stake-constants'
import { useSingleContractMultipleData } from '../../state/multicall/hooks'
import { useMemo } from 'react'
import { usePairs } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'

// gets the staking info from the network for the active chain id
export function useFarmsContracts(): StakingTriStakedAmounts[] {
    const { chainId, account } = useActiveWeb3React()

    const activeFarms = STAKING[chainId ?? ChainId.AURORA]
    const chefContract = useMasterChefContract()
    const chefContractv2 = useMasterChefV2Contract()

    const CHEF_V1_VERSION = 0;
    const CHEF_V2_VERSION = 1;

    const lpAddresses = getLPAddresses(activeFarms, CHEF_V1_VERSION);
    const lpAddressesArgs = getArgs(account, lpAddresses);
    const lpAddressesv2 = getLPAddresses(activeFarms, CHEF_V2_VERSION);
    const lpAddressesv2Args = getArgs(account, lpAddressesv2);

    const userInfo = useSingleContractMultipleData(lpAddressesArgs ? chefContract : null, 'userInfo', lpAddressesArgs!) //user related
    const userInfov2 = useSingleContractMultipleData(lpAddressesv2Args ? chefContractv2 : null, 'userInfo', lpAddressesv2Args!) //user related

    // get all the info from the staking rewards contracts
    const tokens = activeFarms.map(({ tokens }) => tokens);
    const pairs = usePairs(tokens)

    return useMemo(() => {
        if (!chainId || !lpAddresses) {
            return activeFarms
        }

        return lpAddresses.map((_, index) => {
            // User based info
            let userStaked = userInfo[index]
            if (index == 7) {
                userStaked = userInfov2[0]
            } else if (index == 8) {
                userStaked = userInfov2[1]
            }

            const [_pairState, pair] = pairs[index]

            if (
                // always need these
                userStaked?.loading !== false || pair == null
            ) {
                return {
                    ID: activeFarms[index].ID,
                    stakedAmount: null,
                }
            }

            // check for account, if no account set to 0
            const userInfoPool = JSBI.BigInt(userStaked?.result?.['amount'] ?? 0)
            const stakedAmount = new TokenAmount(pair.liquidityToken, JSBI.BigInt(userInfoPool))

            return {
                ID: activeFarms[index].ID,
                stakedAmount: stakedAmount,
            }
        })
            .filter(Boolean)
    }, [chainId, lpAddresses, lpAddressesv2]);
}

function getLPAddresses(activeFarms: StakingTri[], chefVersion: number) {
    return activeFarms
        .filter(key => key.chefVersion === chefVersion)
        .map(key => key.lpAddress);
}

function getArgs(account?: string | null, addresses?: string[]) {
    return (!account || !addresses)
        ? null
        : addresses.map((_, i) => [i.toString(), account?.toString()]);
}