import { ChainId, JSBI, WETH } from '@trisolaris/sdk'
import { Contract } from 'ethers'
import { WBTC, AUUSDC } from '../constants/tokens'
import { useSingleCallResult } from '../state/multicall/hooks'
import { StableSwapPoolTypes } from '../state/stableswap/constants'
import useAurigamiTokenExchangeRate from './useAurigamiTokenExchangeRate'
import { useAurigamiTokenContract } from './useContract'
import useUSDCPrice from './useUSDCPrice'

export default function useStableSwapUSDReferencePrices() {
  let btcPrice = useUSDCPrice(WBTC[ChainId.AURORA])
  let ethPrice = useUSDCPrice(WETH[ChainId.AURORA])
  let auUSDCPrice = useAurigamiTokenExchangeRate(AUUSDC[ChainId.AURORA].address)

  return {
    [StableSwapPoolTypes.BTC]: JSBI.toNumber(btcPrice ?? 0),
    [StableSwapPoolTypes.ETH]: JSBI.toNumber(ethPrice ?? 0),
    [StableSwapPoolTypes.AURIGAMI_STABLE_DEBT]: JSBI.toNumber(auUSDCPrice ?? 0),
    [StableSwapPoolTypes.USD]: 1
  }
}
