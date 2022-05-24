import React, { useState, useCallback } from 'react'

import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'

import { AutoColumn } from '../../components/Column'
import { ButtonConfirmed } from '../../components/Button'
import { LargeHeaderWhite } from './StakeTriV1'
import { RowBetween } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { Text } from 'rebass'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'

import { StyledContainer, StepsContainer, StyledStepNumber, StyledStepNumberDone } from './MigrateXtri.styles'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
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
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!
  const hasPTriBalance = JSBI.greaterThan(pTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)
  const hasMigrated = migrateStatus === MIGRATION_STATUS.MIGRATED

  const migrate = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.migrate(account, XTRI[ChainId.AURORA].address, amount.raw.toString())
        await tx.wait()
        return addTransaction(tx, { summary: 'Migrated xtri' })
      }
    },
    [addTransaction, pTriContract]
  )

  async function handleMigrate() {
    if (xTriBalance?.greaterThan(BIG_INT_ZERO)) {
      if (migrateStatus === MIGRATION_STATUS.NOT_MIGRATED) {
        setMigrateStatus(MIGRATION_STATUS.MIGRATING)
      }
      try {
        setPendingTx(true)
        await migrate(xTriBalance)
      } catch (e) {
        console.error(`Error migrating`, e)
      } finally {
        setPendingTx(false)
        setMigrateStatus(MIGRATION_STATUS.MIGRATED)
      }
    }
  }

  return (
    <StyledContainer>
      <LargeHeaderWhite fontWeight={600}>Introducing 𝜋Tri</LargeHeaderWhite>

      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>
      <RowBetween />
      <StepsContainer>
        <AutoColumn gap="lg">
          <StyledStepNumber>1</StyledStepNumber>
          <Text>First, we need to approve migratting your XTRI </Text>
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
              'Approve'
            )}
          </ButtonConfirmed>
        </AutoColumn>
        <AutoColumn gap="lg">
          <StyledStepNumber>2</StyledStepNumber>
          <Text>No we will migrate your tokens to 𝜋Tri </Text>
          <ButtonConfirmed
            onClick={handleMigrate}
            disabled={approvalState !== ApprovalState.APPROVED || hasMigrated || !hasXTriBalance}
            confirmed={hasMigrated}
          >
            {hasMigrated ? 'Migrated!' : 'Migrate'}
          </ButtonConfirmed>
        </AutoColumn>
        <AutoColumn gap="lg">
          <StyledStepNumberDone>{hasMigrated && <>Done!</>}</StyledStepNumberDone>
        </AutoColumn>
      </StepsContainer>
    </StyledContainer>
  )
}

export default MigrateXtri
