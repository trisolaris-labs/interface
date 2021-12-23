import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import useTimeout from '../../hooks/useTimeout';
import useDebounce from '../../hooks/useDebounce'

const MAX_WAIT_BEFORE_MANUAL_DISPATCH = 2000;

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()

  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  });
  const debouncedState = useDebounce(state, 100);

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
    if (!debouncedState.blockNumber && windowVisible && library && chainId && state.blockNumber) {
      dispatch(updateBlockNumber({ chainId, blockNumber: state.blockNumber }));
    }
  }, [
    library,
    chainId,
    debouncedState.blockNumber,
    windowVisible,
    state.blockNumber,
  ]);
  useTimeout(setDelayTimeout, MAX_WAIT_BEFORE_MANUAL_DISPATCH);

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) {
      return undefined;
    }

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  return null
}