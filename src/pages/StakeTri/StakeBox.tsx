import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ChainId, CurrencyAmount } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../hooks'

import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import ApproveButton from '../../components/ApproveButton'
import StakeButton from './StakeButton'
import Toggle from '../../components/Toggle'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'

import { tryParseAmount } from '../../state/stableswap/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { usePTriContract } from '../../hooks/useContract'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'

import { PTRI, TRI } from '../../constants/tokens'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import { TYPE } from '../../theme'
import { BIG_INT_ZERO } from '../../constants'

const INPUT_CHAR_LIMIT = 18

const StakeBoxContainer = styled.div`
  background: #0e3f69;
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
`

const ButtonsContainer = styled.div`
  margin-top: 20px;
  display: flex;
`

function StakeBox() {
  const { account } = useActiveWeb3React()
  const pTriContract = usePTriContract()
  const addTransaction = useTransactionAdder()
  const { getMaxInputAmount } = useCurrencyInputPanel()

  const triBalance = useTokenBalance(account ?? undefined, TRI[ChainId.AURORA])!
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!

  const [input, _setInput] = useState<string>('')
  const [pendingTx, setPendingTx] = useState(false)
  const [isStaking, setIsStaking] = useState(true)

  const balance = isStaking ? triBalance : pTriBalance

  const parsedAmount = tryParseAmount(input, balance?.currency)

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, PTRI[ChainId.AURORA].address)

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
    amount: balance,
    parsedAmount: parsedAmount
  })

  const deposit = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.deposit(amount?.raw.toString())
        return addTransaction(tx, { summary: 'Deposited into Ptri' })
      }
    },
    [addTransaction, pTriContract]
  )

  const withdraw = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const tx = await pTriContract?.withdraw(amount?.raw.toString())
        return addTransaction(tx, { summary: 'Withdraw pTri' })
      }
    },
    [addTransaction, pTriContract]
  )

  async function handleStakeAndUnstake() {
    try {
      setPendingTx(true)

      if (isStaking) {
        await deposit(parsedAmount)
      } else {
        await withdraw(parsedAmount)
      }

      setInput('')
    } catch (e) {
      console.error(`Error ${isStaking ? 'Staking' : 'Unstaking'}: `, e)
    } finally {
      setPendingTx(false)
    }
  }

  function handleStakeToggle() {
    setIsStaking(!isStaking)
    setInput('')
  }

  return (
    <StakeBoxContainer>
      <RowBetween marginBottom={10}>
        <AutoColumn gap="20px" justify="start">
          <TYPE.mediumHeader>{isStaking ? 'Stake TRI' : 'Unstake pTRI'}</TYPE.mediumHeader>
        </AutoColumn>
        <AutoColumn gap="20px">
          <RowBetween>
            <Toggle
              id="toggle-staking"
              isActive={isStaking}
              toggle={handleStakeToggle}
              customToggleText={{ on: 'Stake', off: 'Unstake' }}
              fontSize="14px"
            />
          </RowBetween>
        </AutoColumn>
      </RowBetween>

      <StakeInputPanel
        value={input!}
        onUserInput={setInput}
        currency={isStaking ? TRI[ChainId.AURORA] : PTRI[ChainId.AURORA]}
        id="stake-currency-input"
        onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
        onClickBalanceButton={handleBalanceClick}
        disableMaxButton={atMaxAmountInput || !balance?.greaterThan(BIG_INT_ZERO)}
        disableHalfButton={atHalfAmountInput || !balance?.greaterThan(BIG_INT_ZERO)}
      />

      <ButtonsContainer>
        {approvalState !== ApprovalState.APPROVED && isStaking && (
          <ApproveButton approvalState={approvalState} handleApproval={handleApproval} />
        )}
        <StakeButton
          balance={balance}
          stakingAmount={parsedAmount}
          approvalState={approvalState}
          isStaking={isStaking}
          pendingTx={pendingTx}
          handleStakeAndUnstake={handleStakeAndUnstake}
        />
      </ButtonsContainer>
    </StakeBoxContainer>
  )
}

export default StakeBox
