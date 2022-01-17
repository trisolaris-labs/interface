import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import useTimeout from '../../hooks/useTimeout'
import useDebounce from '../../hooks/useDebounce'
import { getNetworkLibrary } from '../../connectors'

const MAX_WAIT_BEFORE_MANUAL_DISPATCH = 2000

export default function Updater(): null {
  const networkLibrary = getNetworkLibrary()
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })
  const debouncedState = useDebounce(state, 100)

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(state => {
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
    if (!debouncedState.blockNumber && windowVisible && networkLibrary && chainId && state.blockNumber) {
      dispatch(updateBlockNumber({ chainId, blockNumber: state.blockNumber }))
    }
  }, [debouncedState.blockNumber, windowVisible, networkLibrary, chainId, state.blockNumber, dispatch])
  useTimeout(setDelayTimeout, MAX_WAIT_BEFORE_MANUAL_DISPATCH)

  // attach/detach listeners
  useEffect(() => {
    if (!networkLibrary || !chainId || !windowVisible) {
      return undefined
    }

    setState({ chainId, blockNumber: null })

    networkLibrary
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

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
