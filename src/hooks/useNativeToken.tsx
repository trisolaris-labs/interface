import { useActiveWeb3React } from '../hooks'
import { AVAILABLE_CHAINS_DATA } from '../constants/availableChainsData'

export function useNativeTokenSymbol(symbol: string | undefined): string | undefined {
  if (!symbol) return undefined
  const { chainId } = useActiveWeb3React()
    if (symbol === 'ETH') {
      const nativeToken = chainId ? AVAILABLE_CHAINS_DATA[chainId]?.baseCurrencyLabel : 'ETH'
    return nativeToken
  } else {
    return symbol
  }
}
