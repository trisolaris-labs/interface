import React, { useState, useCallback } from 'react'

import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import { Text } from 'rebass'

import { AutoColumn } from '../../components/Column'
import { ButtonConfirmed } from '../../components/Button'
import { LargeHeaderWhite } from './StakeTriV1'
import { RowBetween } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { TokenPairBackgroundColor } from '../../components/earn/PoolCardTri.styles'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'

import { StyledContainer, StepsContainer, StyledStepNumberDone, StyledAutoColumn } from './MigrateXtri.styles'
import { TYPE } from '../../theme'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  INITIATED,
  MIGRATING,
  MIGRATED
}

function MigrateXtri() {
  const [pendingTx, setPendingTx] = useState(false)
  const [migrateStatus, setMigrateStatus] = useState(MIGRATION_STATUS.NOT_MIGRATED)
  const { account } = useActiveWeb3React()
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[ChainId.AURORA])!
  const hasXTriBalance = JSBI.greaterThan(xTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

  const [approvalState, handleApproval] = useApproveCallback(
    hasXTriBalance ? xTriBalance : undefined,
    PTRI[ChainId.AURORA].address
  )

  const addTransaction = useTransactionAdder()
  const pTriContract = usePTriContract()

  const hasMigrated = migrateStatus === MIGRATION_STATUS.MIGRATED

  const migrate = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.migrate(XTRI[ChainId.AURORA].address, amount.raw.toString())
        await tx.wait()
        return addTransaction(tx, { summary: 'Migrated xtri' })
      }
    },
    [addTransaction, pTriContract]
  )

  async function handleMigrate() {
    if (xTriBalance?.greaterThan(BIG_INT_ZERO)) {
      try {
        setPendingTx(true)
        if (migrateStatus === MIGRATION_STATUS.NOT_MIGRATED) {
          setMigrateStatus(MIGRATION_STATUS.MIGRATING)
        }
        await migrate(xTriBalance)
        setMigrateStatus(MIGRATION_STATUS.MIGRATED)
      } catch (e) {
        console.error(`Error migrating`, e)
        setMigrateStatus(MIGRATION_STATUS.NOT_MIGRATED)
      } finally {
        setPendingTx(false)
      }
    }
  }

  return (
    <StyledContainer>
      <StepsContainer>
        <StyledAutoColumn gap="lg">
          <ButtonConfirmed
            mr="0.5rem"
            onClick={handleApproval}
            confirmed={approvalState === ApprovalState.APPROVED}
            disabled={approvalState !== ApprovalState.NOT_APPROVED || pendingTx}
          >
            {approvalState === ApprovalState.PENDING ? (
              <Dots>Approving</Dots>
            ) : approvalState === ApprovalState.APPROVED ? (
              'Approved'
            ) : (
              'Approve Migrating'
            )}
          </ButtonConfirmed>
        </StyledAutoColumn>

        <StyledAutoColumn gap="lg">
          <ButtonConfirmed
            onClick={handleMigrate}
            disabled={approvalState !== ApprovalState.APPROVED || hasMigrated || !hasXTriBalance}
            confirmed={hasMigrated}
          >
            {hasMigrated ? (
              'Migrated!'
            ) : migrateStatus === MIGRATION_STATUS.MIGRATING ? (
              <Dots>Migrating</Dots>
            ) : (
              'Migrate'
            )}
          </ButtonConfirmed>
        </StyledAutoColumn>

        {hasMigrated && (
          <StyledAutoColumn gap="lg">
            <StyledStepNumberDone>Done!</StyledStepNumberDone>
          </StyledAutoColumn>
        )}
      </StepsContainer>
    </StyledContainer>
  )
}

export default MigrateXtri
