import { BigNumber } from '@ethersproject/bignumber'
import { Token, TokenAmount, ChainId } from '@trisolaris/sdk'
import { ChefVersions } from '../state/stake/stake-constants'
import { MASTERCHEF_ADDRESS_V1,MASTERCHEF_ADDRESS_V2 } from '../state/stake/hooks-sushi'
import { useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'


// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalStakedInPool(token?: Token, version?: ChefVersions): TokenAmount | undefined {

  const masterChefAddress = version === ChefVersions.V1
    ? MASTERCHEF_ADDRESS_V1[ChainId.AURORA]
    : MASTERCHEF_ADDRESS_V2[ChainId.AURORA];

  const contract = useTokenContract(token?.address, false)
  const totalStakedInPool: BigNumber = useSingleCallResult(contract, 'balanceOf', [masterChefAddress])?.result?.[0]

  return token && totalStakedInPool ? new TokenAmount(token, totalStakedInPool.toString()) : undefined
}
