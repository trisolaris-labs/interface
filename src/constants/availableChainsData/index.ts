import availableChainsData from './availableChainsData.json'
import { configManager } from '@trisolaris/sdk'
const defaultChainData: ChainDataType = {
  '1313161554': {
    networkParams: {
      chainId: '4e454152',
      chainName: 'Aurora Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: ['https://mainnet.aurora.dev'],
      blockExplorerUrls: ['https://explorer.aurora.dev/']
    },
    chainLabel: 'Aurora',
    baseCurrencyLabel: 'ETH',
    icon: 'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/chains/aurora.png'
  }
}
export const AVAILABLE_CHAINS_DATA: ChainDataType =
  Object.keys(availableChainsData).length > 0 ? availableChainsData : defaultChainData

//configure the sdk with the addresses
const addressesByChainIdConfig = Object.keys(AVAILABLE_CHAINS_DATA).reduce(
  (acc, chainId:string) => {
    if (AVAILABLE_CHAINS_DATA[chainId]) {
      if (AVAILABLE_CHAINS_DATA[chainId].factoryAddress) acc.factoryAddress[chainId] = AVAILABLE_CHAINS_DATA[chainId].factoryAddress as string
      if (AVAILABLE_CHAINS_DATA[chainId].routerAddress) acc.routerAddress[chainId] = AVAILABLE_CHAINS_DATA[chainId].routerAddress as string
      if (AVAILABLE_CHAINS_DATA[chainId].initCodeHash) acc.initCodeHash[chainId] = AVAILABLE_CHAINS_DATA[chainId].initCodeHash as string
    }
    return acc
  },
  {
    factoryAddress: {},
    routerAddress: {},
    initCodeHash: {}
  } as {
    factoryAddress: { [chainId: string]: string }
    routerAddress: { [chainId: string]: string }
    initCodeHash: { [chainId: string]: string }
  }
)
configManager.configure(addressesByChainIdConfig)
//configure the sdk with the addresses

type ChainDataType = {
  [chainId: string]: {
    networkParams: {
      chainId: string
      chainName: string
      nativeCurrency: {
        name: string
        symbol: string
        decimals: number
      }
      rpcUrls: string[]
      blockExplorerUrls: string[]
    }
    chainLabel: string
    baseCurrencyLabel: string
    icon?: string
    multiCallAddress?: string
    factoryAddress?: string
    routerAddress?: string
    initCodeHash?: string
  }
}
