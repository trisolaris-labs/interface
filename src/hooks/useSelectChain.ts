import { useCallback } from 'react'
import { injected } from '../connectors'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '.'
import { AVAILABLE_CHAINS_DATA } from '../constants'
export default function useSelectChain() {
  const { connector } = useWeb3React()
  const { appSelectedChain } = useActiveWeb3React()
  return useCallback(async () => {
    if (!connector) return
    try {
      try {
        const addChainParameter = AVAILABLE_CHAINS_DATA[appSelectedChain].networkParams
        if (injected !== connector) {
          console.log('Please switch to Aurora network in wallet settings.')
        } else {
          await connector.activate(addChainParameter)
        }
      } catch (error) {
        // In activating a new chain, the connector passes through a deactivated state.
        // If we fail to switch chains, it may remain in this state, and no longer be usable.
        // We defensively re-activate the connector to ensure the user does not notice any change.
        try {
          await connector.activate()
        } catch (error) {
          console.error('Failed to re-activate connector', error)
        }
      }
    } catch (error) {
      console.error('Failed to switch networks', error)
      
    }
  }, [connector, appSelectedChain])
}
