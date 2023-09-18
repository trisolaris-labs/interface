import { Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { network, useConnectors, injected, walletConnect } from '../../connectors'
import { ReactNode, useEffect } from 'react'

const connect = async (connector: Connector) => {
  try {
    console.log(connector)
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  const connectors = useConnectors(undefined)

  useEffect(() => {
    connect(injected)
    connect(walletConnect)
    connect(network)
  }, [])

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}
