import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../Row'
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
import { BIG_INT_ZERO } from '../../constants'

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
  const { chefVersion, earnedAmount, earnedNonTriRewards, noTriRewards, poolId, stakedAmount } = stakingInfo

  async function onWithdraw() {
    if (chefVersion == 0) {
      if (stakingContract && stakedAmount != null) {
        setAttempting(true)
        await stakingContract
          .withdraw(poolId, stakedAmount?.raw.toString())
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
      if (stakingContractv2 && stakedAmount != null) {
        setAttempting(true)
        await stakingContractv2
          .withdrawAndHarvest(poolId, stakedAmount?.raw.toString(), account)
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
          {stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.depositedPglLiquidity')}</TYPE.body>
            </AutoColumn>
          )}
          {earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={earnedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimed')}</TYPE.body>
            </AutoColumn>
          )}
          {chefVersion == 1 && (earnedNonTriRewards.length > 0 || noTriRewards) && (
            <AutoColumn justify="center" gap="md">
              <AutoRow justify="center">
                {earnedNonTriRewards
                  .filter(({ amount }) => amount.greaterThan(BIG_INT_ZERO))
                  .map(({ amount, token }) => (
                    <AutoColumn justify="center" gap="md" key={token.address}>
                      <TYPE.body fontWeight={600} fontSize={36}>
                        {<FormattedCurrencyAmount currencyAmount={amount} />}
                      </TYPE.body>
                      <TYPE.body>
                        {'Unclaimed'} {token.symbol}
                      </TYPE.body>
                    </AutoColumn>
                  ))}
              </AutoRow>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.whenYouWithdrawWarning')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakedAmount} onClick={onWithdraw}>
            {error ?? t('earn.withdrawAndClaim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>{t('earn.withdrawingPgl', { amount: stakedAmount?.toSignificant(4) })}</TYPE.body>
            <TYPE.body fontSize={20}>{t('earn.claimingPng', { amount: earnedAmount?.toSignificant(4) })}</TYPE.body>
            {chefVersion == 1 && (earnedNonTriRewards.length > 0 || noTriRewards) && (
              <TYPE.body fontSize={20}>
                {'Claiming'}{' '}
                {earnedNonTriRewards
                  .filter(({ amount }) => amount.greaterThan(BIG_INT_ZERO))
                  .map(({ amount, token }) => `${amount.toSignificant(4)} ${token.symbol}`)
                  .join(', ')}
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
