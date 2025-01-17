import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { NETWORK_CHAIN_ID } from '../connectors'
import { useUserChainId } from '../state/user/hooks'
import { useDispatch } from 'react-redux'
import { updateChainId } from '../state/user/actions'

export function useActiveWeb3React() {
  const result = useWeb3ReactCore()
  const selectedChain = useUserChainId()
  const dispatch = useDispatch()

  const setSelectedChain = (chainId: string) => {
    dispatch(updateChainId({ chainId: parseInt(chainId) }))
  }

  return {
    ...result,
    chainId: result.chainId === NETWORK_CHAIN_ID ? result.chainId : undefined,
    selectedChain,
    setSelectedChain
  }
}
