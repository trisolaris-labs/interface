import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { Dots } from '../Pool/styleds'
import Modal from '../../components/Modal'
import PoolCardTriRewardText from '../../components/earn/PoolCardTriRewardText'
import { TYPE } from '../../theme'
// import TransactionConfirmationModal from '../../../components/TransactionConfirmationModal'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useFarms } from '../../state/stake/apr'
import { useMasterChefV2Contract } from '../../state/stake/hooks-sushi'
import { usePtriStakeInfo } from '../../hooks/usePtri'

import { PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'
import { MASTERCHEF_ADDRESS_V2 } from '../../state/stake/hooks-sushi'
import { RowBetween } from '../../components/Row'
import { parseUnits } from '@ethersproject/units'

const ButtonsContainer = styled.div`
  margin-top: 20px;
  display: flex;
`

const StyledContainer = styled(AutoColumn)<{ disabled?: boolean }>`
background: #0e3f69
border-radius: 10px;
width: 100%;
padding: 2rem;
`

const StyledModalContainer = styled(AutoColumn)`
  padding: 20px;
`

enum ClaimType {
  CLAIM,
  CLAIM_AND_STAKE
}

function ClaimPtri() {
  const { account } = useActiveWeb3React()
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!
  const pTriContract = usePTriContract()
  const addTransaction = useTransactionAdder()
  const stakingContractv2 = useMasterChefV2Contract()
  const { userClaimableRewards } = usePtriStakeInfo()
  const { apr, nonTriAPRs, poolId } = useFarms().filter(farm => farm.ID === 35)[0]

  const [pendingTx, setPendingTx] = useState<ClaimType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [error, setError] = useState<any>(null)
  const [txHash, setTxHash] = useState<string | undefined>('')

  const hasPTriBalance = pTriBalance?.greaterThan(BIG_INT_ZERO)

  const claim = useCallback(async () => {
    try {
      const tx = await pTriContract?.withdraw(0)
      await tx.wait()
      return addTransaction(tx, { summary: 'Claimed Ptri' })
    } catch (error) {
      if (error?.code === 4001) {
        throw new Error('Transaction rejected.')
      } else {
        console.error(`Deposit failed`, error, 'deposit')
        throw new Error(`Deposit failed: ${error.message}`)
      }
    }
  }, [addTransaction, pTriContract])

  const claimAndStake = useCallback(async () => {
    try {
      await claim()
      const tx = await stakingContractv2?.deposit(poolId, parseUnits('1'), account)
      addTransaction(tx, { summary: `Deposited rewards into USDT-USDC-USN Farm` })
    } catch (error) {
      if (error?.code === 4001) {
        throw new Error('Transaction rejected.')
      } else {
        console.error(`Deposit failed`, error, 'deposit')
        throw new Error(`Deposit failed: ${error.message}`)
      }
    }
  }, [addTransaction, pTriContract])

  async function handleClaim(claimType: ClaimType) {
    try {
      setPendingTx(claimType)
      const claimFn = claimType === ClaimType.CLAIM_AND_STAKE ? claimAndStake : claim
      await claimFn()
    } catch (e) {
      console.error(`Error Claiming: `, e)
    } finally {
      setPendingTx(null)
    }
  }

  return (
    <StyledContainer>
      {/* <TransactionConfirmationModal
        isOpen={confirmationModalOpen}
        onDismiss={setConfirmationModalOpen(false)}
        attemptingTxn={pendingTx}
        hash={txHash}
        content={modalContent}
        pendingText="Claiming rewards"
      /> */}

      <Modal isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <StyledModalContainer>
          <Text marginBottom={20}>
            If you only claim instead of claiming and staking, you will lose this potential profits:
          </Text>
          <RowBetween>
            <Text fontSize={14}>Current USDC-USDT-USN Farm APR:</Text>
            <PoolCardTriRewardText apr={apr} inStaging={false} nonTriAPRs={nonTriAPRs} />
          </RowBetween>

          <ButtonsContainer>
            <ButtonPrimary
              disabled={!hasPTriBalance || !!pendingTx}
              onClick={() => handleClaim(ClaimType.CLAIM_AND_STAKE)}
              marginRight={20}
              fontSize={14}
            >
              {pendingTx === ClaimType.CLAIM_AND_STAKE ? <Dots>Claiming and Staking</Dots> : 'Claim and Stake'}
            </ButtonPrimary>
            <ButtonPrimary
              disabled={!hasPTriBalance || !!pendingTx}
              onClick={() => handleClaim(ClaimType.CLAIM)}
              fontSize={14}
            >
              {pendingTx === ClaimType.CLAIM ? <Dots>Claiming</Dots> : 'Just Claim anyway'}
            </ButtonPrimary>
          </ButtonsContainer>
        </StyledModalContainer>
      </Modal>
      <TYPE.mediumHeader marginBottom={15} justifySelf="center">
        Claim and stake for more rewards
      </TYPE.mediumHeader>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid</Text>
      <ButtonsContainer>
        <ButtonPrimary
          disabled={!hasPTriBalance}
          onClick={() => handleClaim(ClaimType.CLAIM_AND_STAKE)}
          marginRight={20}
        >
          {pendingTx === ClaimType.CLAIM_AND_STAKE ? <Dots>Claiming</Dots> : 'Claim and Stake'}
        </ButtonPrimary>
        <ButtonPrimary disabled={!hasPTriBalance} onClick={() => setOpenModal(true)}>
          Claim
        </ButtonPrimary>
      </ButtonsContainer>
    </StyledContainer>
  )
}

export default ClaimPtri
