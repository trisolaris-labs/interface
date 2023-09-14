import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { NETWORK_CHAIN_ID } from '../connectors'

export function useActiveWeb3React() {
  const result = useWeb3ReactCore()
  return { ...result, chainId: result.chainId === NETWORK_CHAIN_ID ? result.chainId : undefined }
}
