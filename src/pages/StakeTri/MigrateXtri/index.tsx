import React, { useState } from 'react'
import { ChainId, JSBI, TokenAmount } from '@trisolaris/sdk'
import { Text } from 'rebass'

import { ButtonConfirmed } from '../../../components/Button'
import { Dots } from '../../../components/swap/styleds'
import TransactionConfirmationModal, {
  ConfirmationModalContent
} from '../../../components/TransactionConfirmationModal'

import MigrationTransactionModal from './MigrationTransactionModal'

import { useApproveCallback } from '../../../hooks/useApproveCallback'
import { useMigrateCallback } from '../../../hooks/useMigrateCallback'
import { useTriBarStats } from '../../../state/stakeTri/hooks'

import { ApprovalState } from '../../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../../constants/tokens'
import { BIG_INT_ZERO } from '../../../constants'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  MIGRATING,
  MIGRATED
}

function MigrateXtri({ closeModal, xTriBalance }: { closeModal: () => void; xTriBalance: TokenAmount }) {
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

  function MigrationStartModal() {
    return (
      <>
        <TransactionConfirmationModal
          isOpen={confirmationModalOpen}
          onDismiss={onDismiss}
          attemptingTxn={pendingTx}
          hash={txHash}
          content={modalContent}
          pendingText="Migrating xTRI"
        />

        <Text marginTop="15px">
          You have {xTriBalance.toFixed(2)} xTRI available to migrate to <strong>pTRI</strong>, Trisolaris&apos;s
          Revenue Share token.
        </Text>
        <Text marginTop="10px">
          The Trisolaris protocol is improving our reward structure to share all protocol fees with TRI holders, in the
          form of USD LP tokens.
        </Text>
        <Text marginTop="10px">Migrate your current xTRI stake to pTRI to continue receiving protocol rewards.</Text>
      </>
    )
  }

  return (
    <ConfirmationModalContent
      title="Migrate your xTRI"
      onDismiss={onDismiss}
      topContent={MigrationStartModal}
      bottomContent={() => (
        <>
          {(approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) && (
            <ButtonConfirmed mr="0.5rem" onClick={handleApproval} disabled={pendingTx}>
              {approvalState === ApprovalState.PENDING ? <Dots>Approving</Dots> : 'Approve xTRI Migration'}
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
        </>
      )}
    />
  )
}

export default MigrateXtri
