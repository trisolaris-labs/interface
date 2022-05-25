import React, { useState, useCallback, useEffect } from 'react'
import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import { Text } from 'rebass'
import { CloseIcon } from '../../theme'

import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import { ButtonConfirmed } from '../../components/Button'
import { Dots } from '../../components/swap/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'

import { StyledContainer, ButtonsContainer } from './MigrateXtri.styles'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  MIGRATING,
  MIGRATED
}

function MigrateXtri({ closeModal }: { closeModal: () => void }) {
  const { account } = useActiveWeb3React()
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[ChainId.AURORA])!
  const addTransaction = useTransactionAdder()
  const pTriContract = usePTriContract()

  const hasXTriBalance = JSBI.greaterThan(xTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)
  const [approvalState, handleApproval] = useApproveCallback(
    hasXTriBalance ? xTriBalance : undefined,
    PTRI[ChainId.AURORA].address
  )

  const [pendingTx, setPendingTx] = useState(false)
  const [migrateStatus, setMigrateStatus] = useState(MIGRATION_STATUS.NOT_MIGRATED)

  const hasMigrated = migrateStatus === MIGRATION_STATUS.MIGRATED

  const migrate = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.migrate(XTRI[ChainId.AURORA].address, amount.raw.toString())
        addTransaction(tx, { summary: 'Migrated xtri' })
        await tx.wait()
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

  useEffect(() => {
    if (migrateStatus === MIGRATION_STATUS.MIGRATED) {
      setTimeout(() => {
        closeModal()
      }, 3500)
    }
  }, [migrateStatus])

  return (
    <StyledContainer>
      <RowBetween>
        <TYPE.mediumHeader fontWeight={600}>Migrate your xTRI</TYPE.mediumHeader>
        <CloseIcon onClick={closeModal} />
      </RowBetween>
      <Text marginTop="10px">
        You have xTRI available to migrate to the new <span style={{ fontWeight: 600 }}>pTRI</span>, Trisolaris Revenue
        Share token.
      </Text>
      <Text marginTop="10px">
        In order to continue making profits from staking, you need to migrate your current Stake in xTri into the new
        pTri Staking.
      </Text>

      <ButtonsContainer>
        {approvalState === ApprovalState.NOT_APPROVED ||
          (approvalState === ApprovalState.PENDING && (
            <ButtonConfirmed mr="0.5rem" onClick={handleApproval} disabled={pendingTx}>
              {approvalState === ApprovalState.PENDING ? <Dots>Approving</Dots> : 'Approve Migrating xTRI'}
            </ButtonConfirmed>
          ))}

        {approvalState === ApprovalState.APPROVED && (
          <ButtonConfirmed
            onClick={handleMigrate}
            disabled={hasMigrated || !hasXTriBalance || pendingTx}
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
        )}
      </ButtonsContainer>
    </StyledContainer>
  )
}

export default MigrateXtri