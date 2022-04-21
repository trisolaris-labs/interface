import { CurrencyAmount } from '@trisolaris/sdk'
import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { computeSlippageAdjustedMinAmount } from '../utils/prices'
import { useStableSwapContract } from './useContract'
import useTransactionDeadline from './useTransactionDeadline'

type Props = {
  amount: CurrencyAmount | undefined
  estimatedAmounts: CurrencyAmount[]
  stableSwapPoolName: StableSwapPoolName
  withdrawTokenIndex: number | null
  userSlippageTolerance: number
}

export default function useStableSwapRemoveLiquidity({
  amount,
  estimatedAmounts,
  withdrawTokenIndex,
  stableSwapPoolName,
  userSlippageTolerance
}: Props): {
  removeLiquidity: () => Promise<string>
  attemptingTxn: boolean
  txHash: string
  setTxHash: React.Dispatch<React.SetStateAction<string>>
} {
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [txHash, setTxHash] = useState('')

  const pool = STABLESWAP_POOLS[stableSwapPoolName]
  const swapContract = useStableSwapContract(
    stableSwapPoolName,
    true, // require signer
    isMetaPool(stableSwapPoolName) // if it's a metapool, use unwrapped tokens
  )
  const amountString = amount?.toSignificant(6)
  const amountRawString = amount?.raw.toString()

  const estimatedMinAmounts = estimatedAmounts.map(({ raw: amount }) =>
    computeSlippageAdjustedMinAmount(amount, userSlippageTolerance).toString()
  )
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()
  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const removeLiquidity = useCallback(async () => {
    try {
      if (amountRawString == null) {
        return
      }
      setAttemptingTxn(true)
      let transaction
      if (withdrawTokenIndex != null) {
        transaction = await swapContract?.removeLiquidityOneToken(
          amountRawString,
          withdrawTokenIndex,
          estimatedMinAmounts[withdrawTokenIndex],
          deadline?.toNumber()
        )
      } else {
        transaction = await swapContract?.removeLiquidity(amountRawString, estimatedMinAmounts, deadline?.toNumber())
      }

      await transaction.wait()
      setAttemptingTxn(false)

      addTransaction(transaction, {
        summary: `Removed Liquidity: ${amountString} ${pool.lpToken.symbol}`
      })
      setTxHash(transaction.hash)
      return transaction
    } catch (error) {
      setAttemptingTxn(false)
      console.error(error)
    }
  }, [
    addTransaction,
    amountRawString,
    amountString,
    deadline,
    estimatedMinAmounts,
    pool.lpToken.symbol,
    swapContract,
    withdrawTokenIndex
  ])

  return { removeLiquidity, attemptingTxn, txHash, setTxHash }
}
