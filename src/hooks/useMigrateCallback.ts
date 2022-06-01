import { useMemo, useState } from 'react'
import { CurrencyAmount, ChainId } from '@trisolaris/sdk'

import { useTransactionAdder } from '../state/transactions/hooks'
import { usePTriContract } from './useContract'

import { XTRI } from '../constants/tokens'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  MIGRATING,
  MIGRATED
}

export function useMigrateCallback(
  amount: CurrencyAmount | undefined
): { callback: null | (() => Promise<string>); error: string | null; migrationStatus: MIGRATION_STATUS } {
  const addTransaction = useTransactionAdder()
  const pTriContract = usePTriContract()

  const [migrationStatus, setMigrationStatus] = useState<MIGRATION_STATUS>(MIGRATION_STATUS.NOT_MIGRATED)

  return useMemo(() => {
    const migrate = async (): Promise<string> => {
      try {
        setMigrationStatus(MIGRATION_STATUS.MIGRATING)
        const xTriAmount = amount?.raw.toString()
        const tx = await pTriContract?.migrate(XTRI[ChainId.AURORA].address, xTriAmount)
        addTransaction(tx, { summary: `Migrated xTRI` })
        setMigrationStatus(MIGRATION_STATUS.MIGRATED)
        return tx.hash
      } catch (error) {
        setMigrationStatus(MIGRATION_STATUS.NOT_MIGRATED)
        if (error?.code === 4001) {
          throw new Error('Transaction rejected.')
        } else {
          console.error(`Migration failed`, error, 'migrate')
          throw new Error(`Migration failed: ${error.message}`)
        }
      }
    }

    return { callback: migrate, error: null, migrationStatus }
  }, [addTransaction, amount])
}
