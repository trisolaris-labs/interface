import React, { useState, useCallback } from 'react'
import styled from 'styled-components'

import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { Dots } from '../Pool/styleds'
import Modal from '../../components/Modal'
import PoolCardTriRewardText from '../../components/earn/PoolCardTriRewardText'
import { TYPE } from '../../theme'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../../components/TransactionConfirmationModal'
import { RowBetween, RowFixed } from '../../components/Row'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'

import { useActiveWeb3React } from '../../hooks'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useFarms } from '../../state/stake/apr'
import { useMasterChefV2Contract } from '../../state/stake/hooks-sushi'
import { usePtriStakeInfo } from '../../hooks/usePtri'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'

import { BIG_INT_ZERO } from '../../constants'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { DarkGreyCard } from '../../components/Card'

const ButtonsContainer = styled.div`
  margin-top: 20px;
  display: flex;
`

const StyledModalContainer = styled(AutoColumn)`
  padding: 20px;
  width: 100%;
`

enum ClaimType {
  CLAIM,
  CLAIM_AND_STAKE
}

const threePool = STABLESWAP_POOLS.USDC_USDT_USN

function ClaimPtri() {
  const { account } = useActiveWeb3React()
  const pTriContract = usePTriContract()
  const addTransaction = useTransactionAdder()
  const stakingContractv2 = useMasterChefV2Contract()
  const { userClaimableRewards } = usePtriStakeInfo()
  const { apr, nonTriAPRs, poolId, stakingRewardAddress } = useFarms().filter(farm => farm.ID === 35)[0]
  const [approval, approveCallback] = useApproveCallback(userClaimableRewards, stakingRewardAddress)

  const [pendingTx, setPendingTx] = useState<ClaimType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [txHash, setTxHash] = useState<string | undefined>('')
  const [depositTxHash, setDepositTxHash] = useState<string | undefined>('')
  const [claimType, setClaimType] = useState<ClaimType>(ClaimType.CLAIM)
  const [error, setError] = useState<any>(null)
  const [confirmDepositModalOpen, setConfirmDepositModalOpen] = useState(false)

  const hasClaimableRewards = userClaimableRewards?.greaterThan(BIG_INT_ZERO)

  const claim = useCallback(async () => {
    try {
      setPendingTx(ClaimType.CLAIM)
      const tx = await pTriContract?.harvest(account)
      setTxHash(tx.hash)
      addTransaction(tx, { summary: 'Claimed Rewards' })
      return tx
    } catch (error) {
      if ((error as any)?.code === 4001) {
        throw new Error('Transaction rejected.')
      } else {
        console.error(`Claim failed`, error, 'Claim')
        throw new Error(`Claim failed: ${(error as any).message}`)
      }
    }
  }, [account, addTransaction, pTriContract])

  const claimAndStake = useCallback(async () => {
    try {
      setPendingTx(ClaimType.CLAIM)
      const claimTx = await claim()
      claimTx.wait()
      setPendingTx(ClaimType.CLAIM_AND_STAKE)
      setConfirmDepositModalOpen(true)

      const tx = await stakingContractv2?.deposit(poolId, userClaimableRewards.raw.toString(), account)
      setDepositTxHash(tx.hash)
      return addTransaction(tx, { summary: `Deposited rewards into USDT/USDC/USN Farm` })
    } catch (error) {
      if ((error as any)?.code === 4001) {
        throw new Error('Transaction rejected.')
      } else {
        console.error(`Claim and Stake failed`, error, 'Claim and Stake')
        throw new Error(`Claim and Stake failed: ${(error as any).message}`)
      }
    }
  }, [account, addTransaction, claim, poolId, stakingContractv2, userClaimableRewards.raw])

  async function handleClaim() {
    try {
      setClaimType(claimType)
      const claimFn = claimType === ClaimType.CLAIM_AND_STAKE ? claimAndStake : claim
      await claimFn()
    } catch (e) {
      console.error(`Error Claiming: `, e)
      setError(e)
    } finally {
      setPendingTx(null)
    }
  }

  function confirmationHeader() {
    return (
      <AutoColumn justify="center" gap="md">
        <RowFixed marginTop={20}>
          <TYPE.body fontWeight={600} fontSize={36} marginRight={15}>
            {userClaimableRewards?.toFixed(2)}
          </TYPE.body>
          <MultipleCurrencyLogo currencies={threePool.poolTokens} size={24} separation={14} />
        </RowFixed>
        <TYPE.body>Claimable rewards</TYPE.body>
      </AutoColumn>
    )
  }

  function modalContent() {
    return error ? (
      <TransactionErrorContent onDismiss={onDismiss} message={error.message} />
    ) : (
      <ConfirmationModalContent
        title={claimType === ClaimType.CLAIM ? 'Claiming rewards' : 'Claiming and Staking rewards'}
        onDismiss={onDismiss}
        topContent={confirmationHeader}
        bottomContent={() => (
          <AutoColumn>
            {claimType === ClaimType.CLAIM_AND_STAKE && (
              <>
                <RowFixed>
                  <Text fontWeight={500} fontSize={15} marginBottom="10px">
                    Two transactions will be made:
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Text fontWeight={400} fontSize={14} marginBottom="5px">
                    1. Claim pending rewards
                  </Text>
                </RowFixed>
                <RowFixed fontWeight={400} fontSize={14}>
                  <Text>2. Stake rewards into USDC/USDT/USN Farm</Text>
                </RowFixed>
              </>
            )}
            {approval !== ApprovalState.APPROVED ? (
              <ButtonPrimary
                disabled={approval === ApprovalState.UNKNOWN}
                onClick={approveCallback}
                fontSize={16}
                marginTop={20}
              >
                {approval === ApprovalState.UNKNOWN ? (
                  <Dots>Checking Approval</Dots>
                ) : approval === ApprovalState.PENDING ? (
                  <Dots>Approving</Dots>
                ) : (
                  'Approve Depositing rewards'
                )}
              </ButtonPrimary>
            ) : (
              <ButtonPrimary disabled={!!pendingTx} onClick={() => handleClaim()} fontSize={16} marginTop={20}>
                {claimType === ClaimType.CLAIM_AND_STAKE ? 'Claim and Stake' : 'Claim'}
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      />
    )
  }

  function onClaim(claimType: ClaimType) {
    setClaimType(claimType)
    setTxHash(undefined)
    setDepositTxHash(undefined)
    setConfirmationModalOpen(true)
    setError(null)
  }

  function onDismiss() {
    setConfirmationModalOpen(false)
    setConfirmDepositModalOpen(false)
    setOpenModal(false)
  }
  return (
    <DarkGreyCard>
      <Modal isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <StyledModalContainer>
          <Text marginBottom={20}>You can stake your claimed LP tokens to earn the following rewards:</Text>
          <RowBetween>
            <Text fontSize={14}>Current USDC/USDT/USN Farm APR:</Text>
            <PoolCardTriRewardText apr={apr} inStaging={false} nonTriAPRs={nonTriAPRs} />
          </RowBetween>

          <ButtonsContainer>
            <ButtonPrimary
              disabled={!hasClaimableRewards || !!pendingTx}
              onClick={() => onClaim(ClaimType.CLAIM_AND_STAKE)}
              marginRight={20}
              fontSize={14}
            >
              {pendingTx === ClaimType.CLAIM_AND_STAKE ? <Dots>Claiming and Staking</Dots> : 'Claim and Stake'}
            </ButtonPrimary>
            <ButtonPrimary
              disabled={!hasClaimableRewards || !!pendingTx}
              onClick={() => onClaim(ClaimType.CLAIM)}
              fontSize={14}
            >
              {pendingTx === ClaimType.CLAIM ? <Dots>Claiming</Dots> : 'Claim'}
            </ButtonPrimary>
          </ButtonsContainer>
        </StyledModalContainer>
      </Modal>

      <TransactionConfirmationModal
        isOpen={confirmationModalOpen}
        onDismiss={onDismiss}
        attemptingTxn={pendingTx === ClaimType.CLAIM}
        hash={txHash}
        content={modalContent}
        pendingText="Claiming rewards"
      />

      <TransactionConfirmationModal
        isOpen={confirmDepositModalOpen}
        onDismiss={onDismiss}
        attemptingTxn={pendingTx === ClaimType.CLAIM_AND_STAKE}
        hash={depositTxHash}
        content={modalContent}
        pendingText="Staking claimed rewards"
      />

      <TYPE.mediumHeader marginBottom={15} justifySelf="center">
        Claim Protocol Revenue
      </TYPE.mediumHeader>
      <ButtonsContainer>
        {hasClaimableRewards ? (
          <>
            <ButtonLight
              disabled={!hasClaimableRewards}
              onClick={() => onClaim(ClaimType.CLAIM_AND_STAKE)}
              marginRight={20}
            >
              {pendingTx === ClaimType.CLAIM_AND_STAKE ? <Dots>Claiming</Dots> : 'Claim and Stake'}
            </ButtonLight>
            <ButtonLight disabled={!hasClaimableRewards} onClick={() => setOpenModal(true)}>
              Claim
            </ButtonLight>
          </>
        ) : (
          <ButtonPrimary disabled>You don&apos;t have rewards to claim. Please check back later.</ButtonPrimary>
        )}
      </ButtonsContainer>
    </DarkGreyCard>
  )
}

export default ClaimPtri
