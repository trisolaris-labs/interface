import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import useTimeout from '../../hooks/useTimeout'
import useDebounce from '../../hooks/useDebounce'
import { Web3Provider } from '@ethersproject/providers'
import { NetworkContextName } from '../../constants'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { getNetworkLibrary, network } from '../../connectors'

const MAX_WAIT_BEFORE_MANUAL_DISPATCH = 2000

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const networkLibrary = getNetworkLibrary()

  // const test = getNetworkLibrary()
  // test.on('block', block => {
  //   console.log('network heard block: ', block)
  // })

  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  })
  const debouncedState = useDebounce(state, 100)

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      console.log('Network block update: ', blockNumber)
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // If the window's visible, there's a library, and a chainID,
  // and we still don't have a blocknumber after `MAX_WAIT_BEFORE_MANUAL_DISPATCH` seconds
  // Force an update!
  const setDelayTimeout = useCallback(() => {
    if (!debouncedState.blockNumber && windowVisible && library && chainId && state.blockNumber) {
      dispatch(updateBlockNumber({ chainId, blockNumber: state.blockNumber }))
    }
  }, [debouncedState.blockNumber, windowVisible, library, chainId, state.blockNumber, dispatch])
  useTimeout(setDelayTimeout, MAX_WAIT_BEFORE_MANUAL_DISPATCH)

  // attach/detach listeners
  // useEffect(() => {
  //   if (!library || !chainId || !windowVisible) {
  //     return undefined
  //   }

  //   setState({ chainId, blockNumber: null })

  //   library
  //     .getBlockNumber()
  //     .then(block => {
  //       console.log('MM block update: ', block)
  //       blockNumberCallback(block)
  //     })
  //     .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

  //   library.on('block', blockNumberCallback)

  //   return () => {
  //     library.removeListener('block', blockNumberCallback)
  //   }
  // }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  useEffect(() => {
    if (!networkLibrary || !chainId || !windowVisible) {
      return undefined
    }

    setState({ chainId, blockNumber: null })

    networkLibrary
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    networkLibrary.on('block', blockNumberCallback)

    return () => {
      networkLibrary.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, networkLibrary, blockNumberCallback, windowVisible])

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}
