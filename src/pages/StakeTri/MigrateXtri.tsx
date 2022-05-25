import React, { useState, useCallback } from 'react'
import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'

import { ButtonConfirmed } from '../../components/Button'
import { Dots } from '../../components/swap/styleds'
import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { tryParseAmount } from '../../state/stableswap/hooks'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { XTRI, PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'

import { StyledContainer, StepsContainer, StyledStepNumberDone, StyledAutoColumn } from './MigrateXtri.styles'

enum MIGRATION_STATUS {
  NOT_MIGRATED,
  MIGRATING,
  MIGRATED
}

const INPUT_CHAR_LIMIT = 18

function MigrateXtri() {
  const { account } = useActiveWeb3React()
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[ChainId.AURORA])!
  const { getMaxInputAmount } = useCurrencyInputPanel()
  const addTransaction = useTransactionAdder()
  const pTriContract = usePTriContract()

  const hasXTriBalance = JSBI.greaterThan(xTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)
  const [approvalState, handleApproval] = useApproveCallback(
    hasXTriBalance ? xTriBalance : undefined,
    PTRI[ChainId.AURORA].address
  )

  const [pendingTx, setPendingTx] = useState(false)
  const [migrateStatus, setMigrateStatus] = useState(MIGRATION_STATUS.NOT_MIGRATED)
  const [input, _setInput] = useState<string>('')

  const hasMigrated = migrateStatus === MIGRATION_STATUS.MIGRATED

  const parsedAmount = tryParseAmount(input, xTriBalance?.currency)

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

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT)
    _setInput(value)
  }

  const handleBalanceClick = (value: BalanceButtonValueEnum) => {
    const amount = getClickedAmount(value)
    _setInput(amount)
  }

  const { atMaxAmount: atMaxAmountInput, atHalfAmount: atHalfAmountInput, getClickedAmount } = getMaxInputAmount({
    amount: xTriBalance,
    parsedAmount: parsedAmount
  })

  async function handleMigrate() {
    if (xTriBalance?.greaterThan(BIG_INT_ZERO)) {
      try {
        setPendingTx(true)
        if (migrateStatus === MIGRATION_STATUS.NOT_MIGRATED) {
          setMigrateStatus(MIGRATION_STATUS.MIGRATING)
        }
        await migrate(parsedAmount)
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
      <StakeInputPanel
        value={input!}
        onUserInput={setInput}
        currency={XTRI[ChainId.AURORA]}
        id="stake-currency-input"
        onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
        onClickBalanceButton={handleBalanceClick}
        disableMaxButton={atMaxAmountInput}
        disableHalfButton={atHalfAmountInput}
      />

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
