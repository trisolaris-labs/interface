import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@trisolaris/sdk'

const DEFAULT_POLLING_INTERVAL = 15_000; // 15 seconds

const NETWORK_POLLING_INTERVALS: { [chainId: number]: number } = {
  [ChainId.AURORA]: 1_000, // 1 second
  [ChainId.AVALANCHE]: 1_000, // 1 second
  [ChainId.POLYGON]: DEFAULT_POLLING_INTERVAL,
}

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
        ? parseInt(provider.chainId)
        : 'any'
  )

  library.pollingInterval = DEFAULT_POLLING_INTERVAL;

  library.detectNetwork().then((network) => {
    const networkPollingInterval = NETWORK_POLLING_INTERVALS[network.chainId]
    if (networkPollingInterval) {
      console.debug('Setting polling interval', networkPollingInterval)
      library.pollingInterval = networkPollingInterval
    }
  })

  return library
}
