import { Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Wallet, coinbaseWallet, injected, network, useConnectors, walletConnect } from '../../connectors'
import { ReactNode, useEffect } from 'react'

const connect = async (connector: Connector) => {
  try {
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
    const selectedWallet = window.localStorage.getItem('selectedWallet')
    // connect(gnosisSafe)
    connect(network)
    if (selectedWallet === Wallet.INJECTED) {
      connect(injected)
    }
    if (selectedWallet === Wallet.COINBASE_WALLET) {
      connect(coinbaseWallet)
    }
    if (selectedWallet === Wallet.WALLET_CONNECT) {
      connect(walletConnect)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
}
