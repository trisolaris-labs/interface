import { ChainId, CurrencyAmount } from '@trisolaris/sdk'

import { useCallback } from 'react'
import { useTransactionAdder } from '../transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useContract } from '../stake/hooks-sushi'
import { Contract } from '@ethersproject/contracts'
import { abi as TRIBAR_ABI } from '../../constants/abis/TriBar.json'
import { TRI, XTRI } from '../../constants'
import { useTotalSupply } from '../../data/TotalSupply'
import { useTokenBalance } from '../wallet/hooks'

export function useTriBar() {
  const addTransaction = useTransactionAdder()
  const barContract = useTriBarContract()

  const enter = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await barContract?.enter(amount?.raw.toString())
        return addTransaction(tx, { summary: 'Enter TriBar' })
      }
    },
    [addTransaction, barContract]
  )

  const leave = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await barContract?.leave(amount?.raw.toString())
        return addTransaction(tx, { summary: 'Leave TriBar' })
      }
    },
    [addTransaction, barContract]
  )

  return { enter, leave }
}

export function useTriBarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && XTRI[chainId].address, TRIBAR_ABI, withSignerIfPossible)
}

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
