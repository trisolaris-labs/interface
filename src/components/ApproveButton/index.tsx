import React from 'react'
import { CurrencyAmount } from '@trisolaris/sdk'

import { ButtonConfirmed } from '../../components/Button'
import { Dots } from '../../pages/Pool/styleds'

import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'

type ApproveButtonProps = {
  address: string
  amount: CurrencyAmount | undefined
}
function ApproveButton({ address, amount }: ApproveButtonProps) {
  const [approvalState, handleApproval] = useApproveCallback(amount, address)

  return (
    <ButtonConfirmed
      mr="0.5rem"
      onClick={handleApproval}
      confirmed={approvalState === ApprovalState.APPROVED}
      disabled={approvalState !== ApprovalState.NOT_APPROVED}
    >
      {approvalState === ApprovalState.PENDING ? (
        <Dots>Approving</Dots>
      ) : approvalState === ApprovalState.APPROVED ? (
        'Approved'
      ) : (
        'Approve'
      )}
    </ButtonConfirmed>
  )
}

export default ApproveButton
