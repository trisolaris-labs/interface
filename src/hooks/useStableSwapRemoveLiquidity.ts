import { CurrencyAmount, ChainId, BigintIsh, JSBI } from '@trisolaris/sdk'
import { BigNumber } from 'ethers'
import { useState, useCallback } from 'react'
import { BIG_INT_ZERO } from '../constants'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../state/stableswap/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { unwrappedToken } from '../utils/wrappedCurrency'
import { useStableSwapContract } from './useContract'
import useTransactionDeadline from './useTransactionDeadline'

type Props = {
  amount: CurrencyAmount | undefined
  stableSwapPoolName: StableSwapPoolName
  withdrawTokenIndex: number | null
}

export default function useStableSwapRemoveLiquidity({
  amount,
  withdrawTokenIndex,
  stableSwapPoolName
}: Props): () => Promise<string> {
  const pool = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const swapContract = useStableSwapContract(stableSwapPoolName)
  const addTransaction = useTransactionAdder()
  let deadline = useTransactionDeadline()
  const currentTime = BigNumber.from(new Date().getTime())
  if (deadline && deadline < currentTime.add(10)) {
    deadline = currentTime.add(10)
  }

  const removeLiquidity = useCallback(async () => {
    if (amount?.raw == null) {
      return
    }

    const isRemovingOneToken = withdrawTokenIndex != null

    let transaction
    if (isRemovingOneToken) {
      transaction = await swapContract?.removeLiquidityOneToken(
        amount.raw.toString(),
        withdrawTokenIndex,
        amount.raw, // @TODO There's some error here!
        deadline?.toNumber()
      )
    } else {
      transaction = await swapContract?.removeLiquidity(
        amount.raw.toString(),
        amount.raw, // @TODO There's some error here!
        deadline?.toNumber()
      )
    }

    await transaction.wait()

    addTransaction(transaction, {
      summary: `Removed Liquidity: ${CurrencyAmount.fromRawAmount(unwrappedToken(pool.lpToken), amount.raw)} ${
        pool.lpToken.symbol
      }`
    })

    return transaction
  }, [addTransaction, amount?.raw, deadline, pool.lpToken, swapContract, withdrawTokenIndex])

  return removeLiquidity
}
