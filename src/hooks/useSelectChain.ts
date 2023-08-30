import { useCallback } from 'react'

import { useActiveWeb3React } from '.'
import { NETWORK_CHAIN_ID, injected } from '../connectors'
import { CHAIN_PARAMS } from '../constants'
import { useWeb3React } from '@web3-react/core'

export default function useSelectChain() {
  const { connector } = useWeb3React()

  return useCallback(async () => {
    if (!connector) return

    try {
      try {
        // @ts-ignore
        const addChainParameter = CHAIN_PARAMS[NETWORK_CHAIN_ID]

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
      // if (!didUserReject(connection, error) && error.code !== -32002 /* request already pending */) {
      console.error('Failed to switch networks', error)
      //   dispatch(
      //     addPopup({
      //       content: { failedSwitchNetwork: targetChain, type: PopupType.FailedSwitchNetwork },
      //       key: 'failed-network-switch'
      //     })
      //   )
      // }
    }
  }, [connector])
}
