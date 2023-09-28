import { ChainId } from '@trisolaris/sdk'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector, Web3ReactHooks } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { useMemo } from 'react'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL ?? ''

export const NETWORK_CHAIN_ID: ChainId = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1313161554')
const appLogoUrl = 'https://raw.githubusercontent.com/trisolaris-labs/interface/master/public/favicon.png'

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
        projectId: 'c13edb0e380beb4872d04fa7dce7d169',
        chains: [NETWORK_CHAIN_ID],
        showQrModal: true,
        qrModalOptions: {
          explorerRecommendedWalletIds: [
            '76260019aec5a3c44dd2421bf78e80f71a6c090d932c413a287193ed79450694',
            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
            'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a',
            '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3',
            '18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1'
          ]
        }
      }
    })
)

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
      connectors.push(getConnectorListItemForWallet(selectedWallet) as ConnectorListItem)
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
