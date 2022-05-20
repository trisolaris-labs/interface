import React from 'react'
import { CurrencyAmount, TokenAmount } from '@trisolaris/sdk'

import { ButtonError, ButtonPrimary } from '../../components/Button'
import { BIG_INT_ZERO } from '../../constants'
import { ApprovalState } from '../../hooks/useApproveCallback'

type StakeButtonProps = {
  balance: TokenAmount
  stakingAmount: CurrencyAmount | undefined
  approvalState: ApprovalState
  isStaking: boolean
  pendingTx: boolean
  handleStake: () => void
}

function StakeButton({ balance, stakingAmount, approvalState, isStaking, pendingTx, handleStake }: StakeButtonProps) {
    
  const insufficientFunds = (balance?.equalTo(BIG_INT_ZERO) ?? false) || stakingAmount?.greaterThan(balance)
  if (insufficientFunds && stakingAmount?.greaterThan(BIG_INT_ZERO)) {
    return (
      <ButtonError error={true} disabled={true}>
        Insufficient Balance
      </ButtonError>
    )
  }

  const isValid =
    // If user is unstaking, we don't need to check approval status
    (isStaking ? approvalState === ApprovalState.APPROVED : true) &&
    !pendingTx &&
    stakingAmount?.greaterThan(BIG_INT_ZERO) === true

  return (
    <ButtonPrimary disabled={!isValid} onClick={handleStake}>
      {isStaking ? 'Stake' : 'Unstake'}
    </ButtonPrimary>
  )
}

export default StakeButton
