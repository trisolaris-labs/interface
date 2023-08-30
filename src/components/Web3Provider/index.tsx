import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import {
  BACKFILLABLE_WALLETS,
  NETWORK_CHAIN_ID,
  Wallet,
  getConnectorForWallet,
  gnosisSafe,
  network,
  useConnectors
} from '../../connectors'
import { ReactNode, useEffect } from 'react'
import { useActiveWeb3React, useEagerConnect } from '../../hooks'
// import { useAppSelector } from 'state/hooks'

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
  //   const selectedWalletBackfilled = useAppSelector(state => state.user.selectedWalletBackfilled)
  //   const selectedWallet = useAppSelector(state => state.user.selectedWallet)
  // useEagerlyConnect()
  // const connectors = getConne.map<[Connector, Web3ReactHooks]>(({ hooks, connector }) => [connector, hooks])
  const connectors = useConnectors(undefined)
  useEffect(() => {
    // connect(gnosisSafe)

    connect(network)

    // if (selectedWallet) {
    //   connect(getConnectorForWallet(selectedWallet))
    // } else if (!selectedWalletBackfilled) {
    //   BACKFILLABLE_WALLETS.map(getConnectorForWallet).forEach(connect)
    // }
    // The dependency list is empty so this is only run once on mount
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Web3ReactProvider connectors={connectors}>
      {/* <Updater /> */}
      {children}
    </Web3ReactProvider>
  )
}
/** A component to run hooks under the Web3ReactProvider context. */
// function Updater() {
//   const { account, chainId, connector, provider } = useWeb3React()
//   const { pathname } = useLocation()
//   const currentPage = getCurrentPageFromLocation(pathname)

//   // Trace RPC calls (for debugging).
//   const networkProvider = isSupportedChain(chainId) ? RPC_PROVIDERS[chainId] : undefined

//   // Send analytics events when the active account changes.
//   const previousAccount = usePrevious(account)
//   const [connectedWallets, addConnectedWallet] = useConnectedWallets()
//   useEffect(() => {
//     if (account && account !== previousAccount) {
//       const walletType = getConnection(connector).getName()
//       const peerWalletAgent = provider ? getWalletMeta(provider)?.agent : undefined
//       const isReconnect = connectedWallets.some(
//         wallet => wallet.account === account && wallet.walletType === walletType
//       )

//       // User properties *must* be set before sending corresponding event properties,
//       // so that the event contains the correct and up-to-date user properties.
//       user.set(CustomUserProperties.WALLET_ADDRESS, account)
//       user.set(CustomUserProperties.WALLET_TYPE, walletType)
//       user.set(CustomUserProperties.PEER_WALLET_AGENT, peerWalletAgent ?? '')
//       if (chainId) {
//         user.postInsert(CustomUserProperties.ALL_WALLET_CHAIN_IDS, chainId)
//       }
//       user.postInsert(CustomUserProperties.ALL_WALLET_ADDRESSES_CONNECTED, account)

//       sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
//         result: WalletConnectionResult.SUCCEEDED,
//         wallet_address: account,
//         wallet_type: walletType,
//         is_reconnect: isReconnect,
//         peer_wallet_agent: peerWalletAgent,
//         page: currentPage
//       })

//       addConnectedWallet({ account, walletType })
//     }
//   }, [account, addConnectedWallet, currentPage, chainId, connectedWallets, connector, previousAccount, provider])

//   return null
// }
