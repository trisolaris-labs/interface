import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ChainId, JSBI } from '@trisolaris/sdk'

import { ButtonError, ButtonPrimary, ButtonGold } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { Dots } from '../Pool/styleds'
import Modal from '../../components/Modal'
import PoolCardTriRewardText from '../../components/earn/PoolCardTriRewardText'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useFarms } from '../../state/stake/apr'
import { TYPE } from '../../theme'

import { PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'
import { MASTERCHEF_ADDRESS_V2 } from '../../state/stake/hooks-sushi'

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

const StyledButtonGold = styled(ButtonGold)`
  background-color: #b59e5f;
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
  const { apr, nonTriAPRs, poolId } = useFarms().filter(farm => farm.ID === 35)[0]

  const [pendingTx, setPendingTx] = useState<ClaimType | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const hasPTriBalance = JSBI.greaterThan(pTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

  const claim = useCallback(async () => {
    const tx = await pTriContract?.claim(account)

    await tx.wait()
    return addTransaction(tx, { summary: 'Claimed Ptri' })
  }, [addTransaction, pTriContract])

  const claimAndStake = useCallback(async () => {
    const tx = await pTriContract?.claimAndStake(MASTERCHEF_ADDRESS_V2[ChainId.AURORA], account, poolId)

    await tx.wait()
    return addTransaction(tx, { summary: 'Claimed and staked Ptri' })
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
      <Modal isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <StyledModalContainer>
          <Text marginBottom={20}>
            If you only claim instead of claiming and staking, you will lose this potential profits:
          </Text>
          <PoolCardTriRewardText apr={apr} inStaging={false} nonTriAPRs={nonTriAPRs} />
          <ButtonsContainer>
            <ButtonPrimary
              disabled={!hasPTriBalance}
              onClick={() => handleClaim(ClaimType.CLAIM_AND_STAKE)}
              marginRight={20}
              fontSize={14}
            >
              {pendingTx === ClaimType.CLAIM_AND_STAKE ? <Dots>Claiming</Dots> : 'Claim and Stake'}
            </ButtonPrimary>
            <ButtonPrimary disabled={!hasPTriBalance} onClick={() => handleClaim(ClaimType.CLAIM)} fontSize={14}>
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
