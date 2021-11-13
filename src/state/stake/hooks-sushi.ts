import { ChainId, CurrencyAmount, JSBI, Token } from '@trisolaris/sdk'
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../../state/multicall/hooks'
import { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { Contract } from '@ethersproject/contracts'
import { PNG } from '../../constants'
import { Zero } from '@ethersproject/constants'
import concat from 'lodash/concat'
import { useActiveWeb3React } from '../../hooks'
import zip from 'lodash/zip'
import { getAddress } from '@ethersproject/address'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import MASTERCHEF_ABI from '../../constants/abis/masterchef.json'


export type AddressMap = { [chainId: number]: string }
export const MASTERCHEF_ADDRESS: AddressMap = {
  [ChainId.POLYGON]: '0x43A1dD21a5237C6F5eEC94747C28aa3f5C8fa1c7',
  [ChainId.AURORA]: '0x474b825a605c45836Ac50398473059D4c4c6d3Db',
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
  return useContract(chainId && MASTERCHEF_ADDRESS[chainId], MASTERCHEF_ABI, withSignerIfPossible)
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

export function usePendingSushi(farm: any) {
  const { account, chainId } = useActiveWeb3React()

  const contract = useChefContract(farm.chef)

  const args = useMemo(() => {
    if (!account) {
      return
    }
    return [String(farm.id), String(account)]
  }, [farm, account])

  const result = useSingleCallResult(args ? contract : null, 'pendingTri', args)?.result

  const value = result?.[0]

  const amount = value ? JSBI.BigInt(value.toString()) : undefined

  const tokenPNG = new Token(ChainId.POLYGON, '0x831753dd7087cac61ab5644b308642cc1c33dc13', 18, 'QUICK', 'Quick')

  return amount ? CurrencyAmount.fromRawAmount(tokenPNG, amount) : undefined
}

export function usePendingToken(farm: any, contract: any) {
  const { account } = useActiveWeb3React()

  const args = useMemo(() => {
    if (!account || !farm) {
      return
    }
    return [String(farm.pid), String(account)]
  }, [farm, account])

  const pendingTokens = useSingleContractMultipleData(
    args ? contract : null,
    'pendingTokens',
    args!.map(arg => [...arg, '0'])
  )

  return useMemo(() => pendingTokens, [pendingTokens])
}

export function useChefPositions(contract?: Contract | null, rewarder?: Contract | null, chainId = undefined) {
  const { account } = useActiveWeb3React()

  const numberOfPools = useSingleCallResult(contract ? contract : null, 'poolLength', undefined, NEVER_RELOAD)
    ?.result?.[0]

  const args = useMemo(() => {
    if (!account || !numberOfPools) {
      return
    }
    return [...Array(numberOfPools.toNumber()).keys()].map(pid => [String(pid), String(account)])
  }, [numberOfPools, account])

  const pendingTri = useSingleContractMultipleData(args ? contract : null, 'pendingTri', args!)

  const userInfo = useSingleContractMultipleData(args ? contract : null, 'userInfo', args!)

  // const pendingTokens = useSingleContractMultipleData(
  //     rewarder,
  //     'pendingTokens',
  //     args.map((arg) => [...arg, '0'])
  // )

  const getChef = useCallback(() => {
    if (MASTERCHEF_ADDRESS[chainId!] === contract!.address) {
      return Chef.MASTERCHEF
    }
  }, [chainId, contract])

  return useMemo(() => {
    if (!pendingTri || !userInfo) {
      return []
    }
    return zip(pendingTri, userInfo)
      .map((data, i) => ({
        id: args![i][0],
        pendingTri: data[0]!.result?.[0] || Zero,
        amount: data[1]!.result?.[0] || Zero,
        chef: getChef()
        // pendingTokens: data?.[2]?.result,
      }))
      .filter(({ pendingTri, amount }) => {
        return (pendingTri && !pendingTri.isZero()) || (amount && !amount.isZero())
      })
  }, [args, getChef, pendingTri, userInfo])
}

export function usePositions(chainId = undefined) {
  console.log("calling this")
  const [masterChefV1Positions] = [useChefPositions(useMasterChefContract(), undefined, chainId)]
  return masterChefV1Positions
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


