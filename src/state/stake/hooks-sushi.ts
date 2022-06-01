import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { Dispatch, useEffect, useMemo, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { useActiveWeb3React } from '../../hooks'
import { getAddress } from '@ethersproject/address'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import MASTERCHEF_ABI from '../../constants/abis/masterchef.json'
import MASTERCHEF_V2_ABI from '../../constants/abis/masterchefv2.json'
import COMPLEX_REWARDER_ABI from '../../constants/abis/complex-rewarder.json'
import COMPLEX_N_REWARDER_ABI from '../../constants/abis/complex-n-rewarder.json'
import { ChefVersions } from './stake-constants'

export type AddressMap = { [chainId: number]: string }

export const MASTERCHEF_ADDRESS_V1: AddressMap = {
  [ChainId.POLYGON]: '0x43A1dD21a5237C6F5eEC94747C28aa3f5C8fa1c7',
  [ChainId.AURORA]: '0x1f1Ed214bef5E83D8f5d0eB5D7011EB965D0D79B'
}

export const MASTERCHEF_ADDRESS_V2: AddressMap = {
  [ChainId.POLYGON]: '0x43A1dD21a5237C6F5eEC94747C28aa3f5C8fa1c7',
  [ChainId.AURORA]: '0x3838956710bcc9D122Dd23863a0549ca8D5675D6'
}

export enum Chef {
  MASTERCHEF
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_ADDRESS_V1[chainId], MASTERCHEF_ABI, withSignerIfPossible)
}

export function useMasterChefV2Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MASTERCHEF_ADDRESS_V2[chainId], MASTERCHEF_V2_ABI, withSignerIfPossible)
}

export function useMasterChefV2ContractForVersion(
  chefVersion: ChefVersions,
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React()

  const abi = chefVersion === ChefVersions.V1 ? MASTERCHEF_ABI : MASTERCHEF_V2_ABI

  return useContract(
    chainId && (chefVersion === ChefVersions.V1 ? MASTERCHEF_ADDRESS_V1[chainId] : MASTERCHEF_ADDRESS_V2[chainId]),
    abi,
    withSignerIfPossible
  )
}

export function useComplexRewarderContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

export function useComplexNRewarderContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, COMPLEX_N_REWARDER_ABI, withSignerIfPossible)
}

export function useChefContract(chef: Chef) {
  const masterChefContract = useMasterChefContract()
  //   const masterChefV2Contract = useMasterChefV2Contract()
  //   const miniChefContract = useMiniChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract
    }),
    [masterChefContract]
  )
  return useMemo(() => {
    return contracts[chef]
  }, [contracts, chef])
}

const CHEFS = {
  [ChainId.AURORA]: [Chef.MASTERCHEF]
}

export function useChefContracts(chefs: Chef[]) {
  const masterChefContract = useMasterChefContract()
  const contracts = useMemo(
    () => ({
      [Chef.MASTERCHEF]: masterChefContract
    }),
    [masterChefContract]
  )
  return chefs.map(chef => contracts[chef])
}

export function useUserInfo(farm: any, token: any) {
  const { account } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'userInfo', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  return amount ? CurrencyAmount.fromRawAmount(token, amount) : undefined
}

/*
    Currently expensive to render farm list item. The infinite scroll is used to
    to minimize this impact. This hook pairs with it, keeping track of visible
    items and passes this to <InfiniteScroll> component.
  */
export function useInfiniteScroll(items: any[]): [number, Dispatch<number>] {
  const [itemsDisplayed, setItemsDisplayed] = useState(10)
  useEffect(() => setItemsDisplayed(10), [items.length])
  return [itemsDisplayed, setItemsDisplayed]
}

export function getMultipleContracts(
  addressList: string[],
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract[] {
  return addressList.map(address => getContract(address, ABI, library, account))
}

export function useMultipleContracts(
  addressList: string[] | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract[] | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressList || !addressList.length || !ABI || !library) return null
    try {
      return getMultipleContracts(addressList, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressList, ABI, library, withSignerIfPossible, account])
}

export function useComplexRewarderMultipleContracts(
  addressList: string[] | undefined,
  withSignerIfPossible?: boolean
): Contract[] | null {
  return useMultipleContracts(addressList, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}
