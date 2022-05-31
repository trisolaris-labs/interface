import React, { useState, useContext } from 'react'
import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { Text } from 'rebass'

import { TYPE } from '../../../theme'
import { RowBetween } from '../../../components/Row'
import { ButtonConfirmed } from '../../../components/Button'
import { Dots } from '../../../components/swap/styleds'
import TransactionConfirmationModal from '../../../components/TransactionConfirmationModal'
import { CloseIcon } from '../../../theme'
import MigrationTransactionModal from './MigrationTransactionModal'

import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useApproveCallback } from '../../../hooks/useApproveCallback'
import { useMigrateCallback } from '../../../hooks/useMigrateCallback'
import { useTriBarStats } from '../../../state/stakeTri/hooks'

import { ApprovalState } from '../../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../../constants/tokens'
import { BIG_INT_ZERO } from '../../../constants'

import { StyledContainer, ButtonsContainer } from './MigrateXtri.styles'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  MIGRATING,
  MIGRATED
}

function MigrateXtri({ closeModal, xTriBalance }: { closeModal: (() => void) | null; xTriBalance: TokenAmount }) {
  const { xtriToTRIRatio } = useTriBarStats()

  const hasXTriBalance = xTriBalance?.greaterThan(BIG_INT_ZERO)
  const xTriBalanceInTRI = xTriBalance?.multiply(xtriToTRIRatio ?? JSBI.BigInt(1))

  const [approvalState, handleApproval] = useApproveCallback(
    hasXTriBalance ? xTriBalance : undefined,
    PTRI[ChainId.AURORA].address
  )

  const { callback: migrateCallback, error: migrationError, migrationStatus } = useMigrateCallback(xTriBalance)

  const [pendingTx, setPendingTx] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [error, setError] = useState<any>(null)
  const [txHash, setTxHash] = useState<string | undefined>('')

  const hasMigrated = migrationStatus === MIGRATION_STATUS.MIGRATED
  async function handleMigrate() {
    if (xTriBalance?.greaterThan(BIG_INT_ZERO)) {
      try {
        setPendingTx(true)
        const migrationTxHash = await migrateCallback?.()
        setTxHash(migrationTxHash)
      } catch (e) {
        console.error(`Error migrating`, e)

        setError(e)
      } finally {
        setPendingTx(false)
      }
    }
  }

  function onDismiss() {
    closeModal?.()
    setConfirmationModalOpen(false)
  }

  function onMigrateClick() {
    setError(false)
    setTxHash(undefined)
    setConfirmationModalOpen(true)
  }

  function modalContent() {
    return (
      <MigrationTransactionModal
        errorMessage={error?.message}
        onDismiss={onDismiss}
        handleMigrate={handleMigrate}
        pendingTx={pendingTx}
        xTriBalance={xTriBalance}
        xTriBalanceInTRI={xTriBalanceInTRI}
      />
    )
  }

  return (
    <StyledContainer>
      <TransactionConfirmationModal
        isOpen={confirmationModalOpen}
        onDismiss={onDismiss}
        attemptingTxn={pendingTx}
        hash={txHash}
        content={modalContent}
        pendingText="Migrating xTRI"
      />

      <RowBetween>
        <TYPE.mediumHeader fontWeight={600}>Migrate your xTRI</TYPE.mediumHeader>
        {closeModal != null ? <CloseIcon onClick={closeModal} /> : null}
      </RowBetween>
      <Text marginTop="10px">
        You have {xTriBalance.toFixed(2)} xTRI available to migrate to the new{' '}
        <span style={{ fontWeight: 600 }}>pTRI</span>, Trisolaris Revenue Share token.
      </Text>
      <Text marginTop="15px">
        In order to continue making profits from staking, you need to migrate your current Stake in xTri into the new
        pTri Staking.
      </Text>

      <ButtonsContainer>
        {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
          <ButtonConfirmed mr="0.5rem" onClick={handleApproval} disabled={pendingTx}>
            {approvalState === ApprovalState.PENDING ? <Dots>Approving</Dots> : 'Approve Migrating xTRI'}
          </ButtonConfirmed>
        )}
        {(approvalState === ApprovalState.APPROVED || approvalState === ApprovalState.UNKNOWN) && (
          <ButtonConfirmed
            onClick={onMigrateClick}
            disabled={hasMigrated || !hasXTriBalance || pendingTx || approvalState !== ApprovalState.APPROVED}
          >
            {approvalState === ApprovalState.UNKNOWN ? <Dots>Checking Approval</Dots> : 'Migrate'}
          </ButtonConfirmed>
        )}
      </ButtonsContainer>
    </StyledContainer>
  )
}

export default MigrateXtri
