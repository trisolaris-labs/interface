import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { getWalletForConnector, Wallet } from '../connectors'
import { useUserChainId } from '../state/user/hooks'
import { useDispatch } from 'react-redux'
import { updateChainId } from '../state/user/actions'
import { useState } from 'react'
import { AVAILABLE_CHAINS_DATA } from '../constants/availableChainsData'
import { ChainId } from '@trisolaris/sdk'
import { network, injected } from '../connectors'

export function useActiveWeb3React() {
  const result = useWeb3ReactCore()
  const appSelectedChain = useUserChainId()
  const dispatch = useDispatch()
  const { switchProviderChain: setSelectedChain, loading } = useSwitchProviderChain()

  return {
    ...result,
    chainId: result.chainId as number & ChainId,
    appSelectedChain,
    setSelectedChain,
    isSwitchingChain: loading
  }
}

export function useSwitchProviderChain(): {
  switchProviderChain: (chainId: ChainId) => Promise<void>
  loading: boolean
  error: string | null
} {
  const { connector, account, accounts, provider, chainId:providerChainId } = useWeb3ReactCore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()

  async function switchProviderChain(chainId: ChainId) {
    const networkData = AVAILABLE_CHAINS_DATA[chainId]?.networkParams
    if (!networkData) {
      console.error('Missing network data', chainId)
      return
    }
    if (!connector) {
      console.error('Missing connector')
      setError('Missing connector')
      return
    }
    try {
      setLoading(true)
      if (injected === connector) {
        await network.activate(chainId)
        await connector.activate(networkData)
        
        dispatch(updateChainId({ chainId: chainId }))
      } else {
        if (!networkData) {
          console.error('Missing network data')
          setError('Missing network data')
          return
        } else {
          await network.activate(chainId)
          await connector.activate(networkData)
          dispatch(updateChainId({ chainId: chainId }))
        }
      }
    } catch (error) {
      console.error('Failed to switch networks', error)
      try {
        await connector.activate('wallet_addEthereumChain', networkData)
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
