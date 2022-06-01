import React from 'react'

import { ButtonConfirmed } from '../../components/Button'
import { Dots } from '../../pages/Pool/styleds'

import { ApprovalState } from '../../hooks/useApproveCallback'

type ApproveButtonProps = {
  approvalState: ApprovalState
  handleApproval: () => void
}
function ApproveButton({ approvalState, handleApproval }: ApproveButtonProps) {
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
