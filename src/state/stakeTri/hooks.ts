import { ChainId } from '@trisolaris/sdk'

import { TRI, XTRI } from '../../constants/tokens'
import { useTotalSupply } from '../../data/TotalSupply'
import { useTokenBalance } from '../wallet/hooks'

export function useTriBarStats() {
  const chainId = ChainId.AURORA
  const totalXTri = useTotalSupply(XTRI[chainId])
  const totalTriStaked = useTokenBalance(XTRI[chainId].address, TRI[chainId])

  const xtriToTRIRatio = totalTriStaked != null && totalXTri != null ? totalTriStaked.divide(totalXTri) : null
  const triToXTRIRatio = totalTriStaked != null && totalXTri != null ? totalXTri.divide(totalTriStaked) : null

  return {
    totalTriStaked,
    totalXTri,
    triToXTRIRatio,
    xtriToTRIRatio
  }
}
