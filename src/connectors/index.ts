import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect, WalletConnectConstructorArgs } from '@web3-react/walletconnect-v2'
// import { SupportedChainId } from 'constants/chains'
import { useMemo } from 'react'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL ?? ''

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1313161554')
const appLogoUrl = 'https://raw.githubusercontent.com/trisolaris-labs/interface/master/public/favicon.png'
// if (typeof NETWORK_URL === 'undefined') {
//   throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
// }

// export const network = new NetworkConnector({
//   urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
//   defaultChainId: NETWORK_CHAIN_ID
// })

// let networkLibrary: undefined
// export function getNetworkLibrary(): Web3Provider | undefined {
//   const { provider } = useActiveWeb3React()
//   return provider
// }

// export const injected = new InjectedConnector({
//   supportedChainIds: [NETWORK_CHAIN_ID]
// })

// export const brave = new InjectedConnector({
//   supportedChainIds: [NETWORK_CHAIN_ID]
// })

// export const walletlink = new WalletLinkConnector({
//   url: NETWORK_URL,
//   appName: 'Trisolaris',
//   appLogoUrl: 'https://raw.githubusercontent.com/trisolaris-labs/interface/master/public/favicon.png'
// })

// export const walletconnect = new WalletConnectConnector({
//   rpc: {
//     NETWORK_CHAIN_ID: NETWORK_URL
//   },
//   qrcode: true,
//   bridge: 'https://bridge.walletconnect.org'
// })

export enum Wallet {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  FORTMATIC = 'FORTMATIC',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE'
}
export const BACKFILLABLE_WALLETS = [Wallet.COINBASE_WALLET, Wallet.WALLET_CONNECT, Wallet.INJECTED]
export const SELECTABLE_WALLETS = [...BACKFILLABLE_WALLETS]

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

export function getWalletForConnector(connector: Connector) {
  switch (connector) {
    case injected:
      return Wallet.INJECTED
    case coinbaseWallet:
      return Wallet.COINBASE_WALLET
    case walletConnect:
      return Wallet.WALLET_CONNECT
    case network:
      return Wallet.NETWORK
    case gnosisSafe:
      return Wallet.GNOSIS_SAFE
    default:
      throw Error('unsupported connector')
  }
}

export function getConnectorForWallet(wallet: Wallet) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injected
    case Wallet.COINBASE_WALLET:
      return coinbaseWallet
    case Wallet.WALLET_CONNECT:
      return walletConnect
    case Wallet.NETWORK:
      return network
    case Wallet.GNOSIS_SAFE:
      return gnosisSafe
  }
}

function getHooksForWallet(wallet: Wallet) {
  switch (wallet) {
    case Wallet.INJECTED:
      return injectedHooks
    case Wallet.COINBASE_WALLET:
      return coinbaseWalletHooks
    case Wallet.WALLET_CONNECT:
      return walletConnectHooks
    case Wallet.NETWORK:
      return networkHooks
    case Wallet.GNOSIS_SAFE:
      return gnosisSafeHooks
  }
}

export const [network, networkHooks] = initializeConnector<Network>(
  actions =>
    new Network({
      actions,
      urlMap: {
        [NETWORK_CHAIN_ID]: NETWORK_URL
      },
      defaultChainId: NETWORK_CHAIN_ID
    })
)

export const [injected, injectedHooks] = initializeConnector<MetaMask>(actions => new MetaMask({ actions, onError }))

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>(actions => new GnosisSafe({ actions }))

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
  actions =>
    new WalletConnect({
      actions,
      options: {
        projectId: '03219a485a6a9df1269c77f5b2f8c6d9',
        chains: [NETWORK_CHAIN_ID],
        showQrModal: true
      }
    })
)

// export const [fortmatic, fortmaticHooks] = initializeConnector<EIP1193>(
//   actions => new EIP1193({ actions, provider: new Fortmatic(process.env.REACT_APP_FORTMATIC_KEY).getProvider() })
// )

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: NETWORK_URL,
        appName: 'Uniswap',
        appLogoUrl: appLogoUrl
      },
      onError
    })
)

interface ConnectorListItem {
  connector: Connector
  hooks: Web3ReactHooks
}

function getConnectorListItemForWallet(wallet: Wallet) {
  return {
    connector: getConnectorForWallet(wallet),
    hooks: getHooksForWallet(wallet)
  }
}

export function useConnectors(selectedWallet: Wallet | undefined) {
  return useMemo(() => {
    const connectors: ConnectorListItem[] = [{ connector: gnosisSafe, hooks: gnosisSafeHooks }]
    if (selectedWallet) {
      // @ts-ignore
      connectors.push(getConnectorListItemForWallet(selectedWallet))
    }
    connectors.push(
      // @ts-ignore
      ...SELECTABLE_WALLETS.filter(wallet => wallet !== selectedWallet).map(getConnectorListItemForWallet)
    )
    connectors.push({ connector: network, hooks: networkHooks })
    const web3ReactConnectors: [Connector, Web3ReactHooks][] = connectors.map(({ connector, hooks }) => [
      connector,
      hooks
    ])
    return web3ReactConnectors
  }, [selectedWallet])
}
