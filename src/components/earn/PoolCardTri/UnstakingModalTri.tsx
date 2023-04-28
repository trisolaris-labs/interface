import React, { useState } from 'react'
import Modal from '../../Modal'
import { AutoColumn } from '../../Column'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../../Row'
import { TYPE, CloseIcon } from '../../../theme'
import { ButtonError } from '../../Button'
import { SubmittedView, LoadingView } from '../../ModalViews'
import { useMasterChefContract, useMasterChefV2Contract } from '../../../state/stake/hooks-sushi'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import FormattedCurrencyAmount from '../../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../../hooks'
import { useTranslation } from 'react-i18next'
import { ChefVersions, EarnedNonTriRewards, StakingTri } from '../../../state/stake/stake-constants'
import { BIG_INT_ZERO, ZERO_ADDRESS } from '../../../constants'
import { ChainId, Token, TokenAmount } from '@trisolaris/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface UnStakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  chefVersion: ChefVersions
  earnedAmount?: TokenAmount
  earnedNonTriRewards: EarnedNonTriRewards[]
  noTriRewards: boolean
  poolId: number
  stakedAmount?: TokenAmount | null
}

export default function UnstakingModal({
  isOpen,
  onDismiss,
  chefVersion,
  earnedAmount,
  earnedNonTriRewards,
  noTriRewards,
  poolId,
  stakedAmount
}: UnStakingModalProps) {
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

  async function onWithdraw() {
    if (chefVersion == 0) {
      if (stakingContract && stakedAmount != null) {
        setAttempting(true)
        await stakingContract
          .withdraw(poolId, stakedAmount?.raw.toString())
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.withdrawDepositedLiquidity') as string
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
              summary: t('earn.withdrawDepositedLiquidity') as string
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
    error = t('earn.connectWallet') as string
  }
  if (!stakedAmount) {
    error = error ?? (t('earn.enterAmount') as string)
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
              <TYPE.body>{t('earn.depositedPglLiquidity') as string}</TYPE.body>
            </AutoColumn>
          )}
          {earnedAmount?.greaterThan(BIG_INT_ZERO) && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={earnedAmount} />}
              </TYPE.body>
              <TYPE.body>{t('earn.unclaimed') as string}</TYPE.body>
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
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.whenYouWithdrawWarning') as string}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakedAmount} onClick={onWithdraw}>
            {error ?? (t('earn.withdrawAndClaim') as string)}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOndismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {t('earn.withdrawingPgl', { amount: stakedAmount?.toSignificant(4) }) as string}
            </TYPE.body>
            <TYPE.body fontSize={20}>
              {t('earn.claimingPng', { amount: earnedAmount?.toSignificant(4) }) as string}
            </TYPE.body>
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
            <TYPE.largeHeader>{t('earn.transactionSubmitted') as string}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{t('earn.withdrewPgl') as string}</TYPE.body>
            <TYPE.body fontSize={20}>{t('earn.claimedPng') as string}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
