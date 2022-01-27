import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { useMasterChefContract, useMasterChefV2Contract } from '../../state/stake/hooks-sushi'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { StakingTri } from '../../state/stake/stake-constants'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingTri
}

export default function ClaimRewardModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)
  const chefVersion = stakingInfo.chefVersion
  const doubleRewardsOn = stakingInfo.doubleRewards
  const doubleRewardToken = stakingInfo.doubleRewardToken
  const noTriRewards = stakingInfo.noTriRewards

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useMasterChefContract()
  const stakingContractv2 = useMasterChefV2Contract()

  async function onClaimReward() {
    if (stakingInfo.chefVersion == 0) {
      if (stakingContract && stakingInfo?.stakedAmount) {
        setAttempting(true)
        await stakingContract
          .harvest(stakingInfo.poolId)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.claimAccumulated')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      }
    } else {
      if (stakingContractv2 && stakingInfo?.stakedAmount) {
        setAttempting(true)
        await stakingContractv2
          .harvest(stakingInfo.poolId, account)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.claimAccumulated')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      }
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t('earn.enterAmount')
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>{t('earn.claim')}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {stakingInfo?.earnedAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimed')}</TYPE.body>
            </AutoColumn>
          )}
          {chefVersion == 1 && (doubleRewardsOn || noTriRewards) && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {stakingInfo?.doubleRewardAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>
                {'Unclaimed'} {doubleRewardToken.symbol}
              </TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.liquidityRemainsPool')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
            {error ?? t('earn.claim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.claimingPng', { amount: stakingInfo?.earnedAmount?.toSignificant(6) })}
            </TYPE.body>
            {chefVersion == 1 && (doubleRewardsOn || noTriRewards) && (
              <TYPE.body fontSize={20}>
                {'Claiming'} {stakingInfo?.doubleRewardAmount?.toSignificant(4)} {doubleRewardToken.symbol}
              </TYPE.body>
            )}
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.claimedPng')}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
