import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { ChainId, JSBI } from '@trisolaris/sdk'

import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { Dots } from '../Pool/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { usePTriContract } from '../../hooks/useContract'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TYPE } from '../../theme'

import { PTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'

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

enum ClaimType {
  CLAIM
}

function ClaimPtri() {
  const { account } = useActiveWeb3React()
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!
  const pTriContract = usePTriContract()
  const addTransaction = useTransactionAdder()

  const [pendingTx, setPendingTx] = useState<ClaimType | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const hasPTriBalance = JSBI.greaterThan(pTriBalance?.raw ?? BIG_INT_ZERO, BIG_INT_ZERO)

  const claim = useCallback(async () => {
    const tx = await pTriContract?.withdraw(0)

    await tx.wait()
    return addTransaction(tx, { summary: 'Claimed Ptri' })
  }, [addTransaction, pTriContract])

  async function handleClaim(claimType: ClaimType) {
    try {
      setPendingTx(claimType)
      await claim()
    } catch (e) {
      console.error(`Error Claiming: `, e)
    } finally {
      setPendingTx(null)
      setOpenModal(false)
    }
  }

  return (
    <StyledContainer>
      <TYPE.mediumHeader marginBottom={15} justifySelf="center">
        Claim your rewards
      </TYPE.mediumHeader>
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incid</Text>
      <ButtonsContainer>
        <ButtonPrimary disabled={!hasPTriBalance} onClick={() => handleClaim(ClaimType.CLAIM)}>
          {pendingTx === ClaimType.CLAIM ? <Dots>Claiming</Dots> : 'Claim'}
        </ButtonPrimary>
      </ButtonsContainer>
    </StyledContainer>
  )
}

export default ClaimPtri
