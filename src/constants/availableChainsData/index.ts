import availableChainsData from './availableChainsData.json'

const defaultChainData:ChainDataType = {
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
export const AVAILABLE_CHAINS_DATA: ChainDataType = Object.keys(availableChainsData).length > 0 ? availableChainsData : defaultChainData 

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
  }
}
