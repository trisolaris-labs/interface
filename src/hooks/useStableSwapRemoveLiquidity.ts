import { CurrencyAmount, ChainId } from '@trisolaris/sdk'
import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { computeSlippageAdjustedMinAmount } from '../utils/prices'
import { unwrappedToken } from '../utils/wrappedCurrency'
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

  const pool = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const swapContract = useStableSwapContract(stableSwapPoolName)
  const amountString = amount?.raw.toString()

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
      if (amountString == null) {
        return
      }
      setAttemptingTxn(true)
      let transaction
      if (withdrawTokenIndex != null) {
        transaction = await swapContract?.removeLiquidityOneToken(
          amountString,
          withdrawTokenIndex,
          estimatedMinAmounts[withdrawTokenIndex],
          deadline?.toNumber()
        )
      } else {
        transaction = await swapContract?.removeLiquidity(amountString, estimatedMinAmounts, deadline?.toNumber())
      }

      await transaction.wait()
      setAttemptingTxn(false)

      addTransaction(transaction, {
        // summary: `Removed Liquidity: ${CurrencyAmount.fromRawAmount(unwrappedToken(pool.lpToken), amountString)} ${
        //   pool.lpToken.symbol
        // }`
        summary: `Removed Liquidity: ${amount?.toSignificant(6)} ${pool.lpToken.symbol}`
      })
      setTxHash(transaction.hash)
      return transaction
    } catch (error) {
      setAttemptingTxn(false)
      console.error(error)
    }
  }, [addTransaction, amountString, deadline, estimatedMinAmounts, pool.lpToken, swapContract, withdrawTokenIndex])

  return { removeLiquidity, attemptingTxn, txHash, setTxHash }
}
