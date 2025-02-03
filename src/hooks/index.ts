import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { getWalletForConnector, Wallet } from '../connectors'
import { useUserChainId } from '../state/user/hooks'
import { useDispatch } from 'react-redux'
import { updateChainId } from '../state/user/actions'
import { useState } from 'react'
import { AVAILABLE_CHAINS_DATA } from '../constants'
import { ChainId } from '@trisolaris/sdk'
import { network } from '../connectors'

export function useActiveWeb3React() {
  const result = useWeb3ReactCore()
  const appSelectedChain = useUserChainId()
  const dispatch = useDispatch()
  const setSelectedChain = (chainId: string) => {
    dispatch(updateChainId({ chainId: parseInt(chainId) }))
  }

  return {
    ...result,
    chainId: result.chainId as ChainId,
    appSelectedChain,
    setSelectedChain
  }
}

export function useSwitchProviderChain(): {
  switchProviderChain: (chainId: ChainId) => Promise<void>
  loading: boolean
  error: string | null
} {
  const { connector, account, accounts, provider} = useWeb3ReactCore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function switchProviderChain(chainId: ChainId) {
    const networkData = AVAILABLE_CHAINS_DATA[chainId].networkParams
    if(!networkData) {
      return
    }
    const params = {
      chainId: +chainId,
      chainName: networkData.chainName,
      nativeCurrency: networkData.nativeCurrency,
      rpcUrls: networkData.rpcUrls,
      blockExplorerUrls: networkData.blockExplorerUrls
    }
    if (!connector) {
      console.error('Missing connector')
      setError('Missing connector')
      return
    }
    
    try {
      setLoading(true)
      const connectionType = getWalletForConnector(connector)
      if (connectionType === Wallet.WALLET_CONNECT || connectionType === Wallet.NETWORK || Wallet.GNOSIS_SAFE) {
        await network.activate(chainId)
        await connector.activate(networkData)
        return
      } else {
        if (!networkData) {
          console.error('Missing network data')
          setError('Missing network data')
          return
        }
       
      }
    } catch (error) {
      try {
        await connector.activate('wallet_addEthereumChain', params)
      } catch (error) {
        console.error('Failed to switch networks', error)
        setError('Failed to switch networks')
      }
    } finally {
      setLoading(false)
    }
  }

  return { switchProviderChain, loading, error }
}
