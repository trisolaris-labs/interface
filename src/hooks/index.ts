import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@trisolaris/sdk'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { NETWORK_CHAIN_ID, injected } from '../connectors'
import { NetworkContextName } from '../constants'

export function useActiveWeb3React() {
  // const context = useWeb3ReactCore<Web3Provider>()
  // const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  // return context.active ? context : contextNetwork
  const result = useWeb3ReactCore()
  return { ...result, chainId: result.chainId === NETWORK_CHAIN_ID ? result.chainId : undefined }
}

export function useEagerConnect() {
  // @ts-ignore
  const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if (injected.connectEagerly) {
      setTried(true)
      injected.connectEagerly()
    } else {
      injected.activate()
    }
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  // @ts-ignore
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error: any) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error: any) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
