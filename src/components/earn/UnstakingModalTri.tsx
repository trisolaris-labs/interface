import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { SubmittedView, LoadingView } from '../ModalViews'
import { useMasterChefContract, useMasterChefV2Contract } from '../../state/stake/hooks-sushi'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { StakingTri } from '../../state/stake/stake-constants'
import { parseUnits } from '@ethersproject/units'
import { CurrencyAmount } from '@trisolaris/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingTri
}

export default function UnstakingModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useMasterChefContract()
  const stakingContractv2 = useMasterChefV2Contract()
  const chefVersion = stakingInfo.chefVersion
  const doubleRewardsOn = stakingInfo.doubleRewards
  const doubleRewardToken = stakingInfo.doubleRewardToken

  async function onWithdraw() {
    if (stakingInfo.chefVersion == 0) {
      if (stakingContract && stakingInfo?.stakedAmount) {
        setAttempting(true)
        await stakingContract
          .withdraw(stakingInfo.poolId, stakingInfo.stakedAmount.raw.toString())
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.withdrawDepositedLiquidity')
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
          .withdrawAndHarvest(stakingInfo.poolId, stakingInfo.stakedAmount.raw.toString(), account)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.withdrawDepositedLiquidity')
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
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOndismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.depositedPglLiquidity')}</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimed')}</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.doubleRewardAmount && chefVersion == 1 && doubleRewardsOn && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.doubleRewardAmount} />}
              </TYPE.body>
              <TYPE.body>
                {'Unclaimed'} {doubleRewardToken.symbol}
              </TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.whenYouWithdrawWarning')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? t('earn.withdrawAndClaim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.withdrawingPgl', { amount: stakingInfo?.stakedAmount?.toSignificant(4) })}
            </TYPE.body>
            <TYPE.body fontSize={20}>
              {t('earn.claimingPng', { amount: stakingInfo?.earnedAmount?.toSignificant(4) })}
            </TYPE.body>
            {stakingInfo?.doubleRewardAmount && chefVersion == 1 && doubleRewardsOn && (
              <TYPE.body fontSize={20}>
                {t('earn.claimingAurora', { amount: stakingInfo?.doubleRewardAmount?.toSignificant(4) })}
              </TYPE.body>
            )}
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOndismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.withdrewPgl')}</TYPE.body>
            <TYPE.body fontSize={20}>{t('earn.claimedPng')}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
