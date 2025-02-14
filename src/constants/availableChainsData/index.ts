import { ChainId } from 'types'
import availableChainsData from './availableChainsData.json'
import { configManager, Token } from '@trisolaris/sdk'
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
    WETH: {
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Eth',
      address: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'
    },
    factoryAddress: "0xc66F594268041dB60507F00703b152492fb176E7",
    routerAddress: "0x2CB45Edb4517d5947aFdE3BEAbF95A582506858B",
    initCodeHash: "0x754e1d90e536e4c1df81b7f030f47b4ca80c87120e145c294f098c83a6cb5ace",
    chainLabel: 'Aurora',
    baseCurrencyLabel: 'ETH',
    icon: 'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/chains/aurora.png'
  }
}

export const AVAILABLE_CHAINS_DATA: ChainDataType =
  Object.keys(availableChainsData).length > 0 ? availableChainsData : defaultChainData

//configure the sdk with the addresses
const addressesByChainIdConfig = Object.keys(AVAILABLE_CHAINS_DATA).reduce(
  (acc, chainId: string) => {
    if (AVAILABLE_CHAINS_DATA[chainId]) {
      if (AVAILABLE_CHAINS_DATA[chainId].factoryAddress)
        acc.factoryAddress[chainId] = AVAILABLE_CHAINS_DATA[chainId].factoryAddress as string
      if (AVAILABLE_CHAINS_DATA[chainId].routerAddress)
        acc.routerAddress[chainId] = AVAILABLE_CHAINS_DATA[chainId].routerAddress as string
      if (AVAILABLE_CHAINS_DATA[chainId].initCodeHash)
        acc.initCodeHash[chainId] = AVAILABLE_CHAINS_DATA[chainId].initCodeHash as string
      if (AVAILABLE_CHAINS_DATA[chainId].networkParams.nativeCurrency)
        acc.nativeCurrency[chainId] = AVAILABLE_CHAINS_DATA[chainId].networkParams.nativeCurrency
      if (AVAILABLE_CHAINS_DATA[chainId].WETH !== undefined) {
        const { address, decimals, symbol, name } = AVAILABLE_CHAINS_DATA[chainId].WETH as { address: string, decimals: number, symbol: string, name: string }
        const token = new Token(
          +chainId,
          address,
          decimals,
          symbol,
          name
        )
        acc.WETH[chainId] = token
      }
    }
    return acc
  },
  {
    factoryAddress: {},
    routerAddress: {},
    initCodeHash: {},
    WETH: {},
    nativeCurrency: {}
  } as {
    factoryAddress: { [chainId: string]: string }
    routerAddress: { [chainId: string]: string }
    initCodeHash: { [chainId: string]: string }
    WETH: { [chainId: string]: Token }
    nativeCurrency: { [chainId: string]: { name: string; symbol: string; decimals: number } }
  }
)

//configure the sdk with the addresses
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
    WETH?: {
      decimals: number,
      symbol: string,
      name: string,
      address: string
    }
    factoryAddress?: string
    routerAddress?: string
    initCodeHash?: string
  }
}
