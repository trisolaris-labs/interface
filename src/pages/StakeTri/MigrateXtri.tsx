import React, { useState, useCallback } from 'react'

import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'

import { AutoColumn } from '../../components/Column'
import { ButtonConfirmed } from '../../components/Button'
import { LargeHeaderWhite } from './StakeTriV1'
import { RowBetween } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'

import { StyledContainer, StepsContainer, StyledStepNumber } from './MigrateXtri.styles'

function MigrateXtri() {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useActiveWeb3React()
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[ChainId.AURORA])!

  const [approvalState, handleApproval] = useApproveCallback(xTriBalance, PTRI[ChainId.AURORA].address)

  const addTransaction = useTransactionAdder()

  const pTriContract = usePTriContract()
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!

  const hasPTriBalance = JSBI.greaterThan(pTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

  const migrate = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.migrate(account, XTRI[ChainId.AURORA].address, amount.raw.toString())
        return addTransaction(tx, { summary: 'Migrated xtri' })
      }
    },
    [addTransaction, pTriContract]
  )

  async function handleMigrate() {
    if (xTriBalance?.greaterThan(BIG_INT_ZERO)) {
      try {
        setPendingTx(true)
        await migrate(xTriBalance)
      } catch (e) {
        console.error(`Error migrating`, e)
      } finally {
        setPendingTx(false)
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
          <ButtonConfirmed
            maxWidth={150}
            onClick={handleMigrate}
            disabled={
              approvalState !== ApprovalState.APPROVED || hasPTriBalance || JSBI.equal(xTriBalance?.raw, BIG_INT_ZERO)
            }
            confirmed={hasPTriBalance}
          >
            {hasPTriBalance ? 'Migrated!' : 'Migrate'}
          </ButtonConfirmed>
        </AutoColumn>
        <AutoColumn gap="lg">
          {hasPTriBalance && (
            <>
              <StyledStepNumber>✓</StyledStepNumber>
              <div>Done!</div>
            </>
          )}
        </AutoColumn>
      </StepsContainer>
    </StyledContainer>
  )
}

export default MigrateXtri
