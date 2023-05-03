import React, { useState } from 'react'
import Modal from '../../Modal'
import { AutoColumn } from '../../Column'
import styled from 'styled-components'
import { AutoRow, RowBetween } from '../../Row'
import { TYPE, CloseIcon } from '../../../theme'
import { ButtonError } from '../../Button'
import { useMasterChefContract, useMasterChefV2Contract } from '../../../state/stake/hooks-sushi'
import { SubmittedView, LoadingView } from '../../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { useActiveWeb3React } from '../../../hooks'
import { useTranslation } from 'react-i18next'
import { ChefVersions, EarnedNonTriRewards } from '../../../state/stake/stake-constants'
import { BIG_INT_ZERO } from '../../../constants'
import { TokenAmount } from '@trisolaris/sdk'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  chefVersion: ChefVersions
  earnedNonTriRewards?: EarnedNonTriRewards[]
  noTriRewards?: boolean
  poolId?: number
  earnedAmount?: TokenAmount
  stakedAmount?: TokenAmount | null
}

export default function ClaimRewardModal({
  isOpen,
  onDismiss,
  chefVersion,
  earnedNonTriRewards = [],
  noTriRewards,
  poolId,
  stakedAmount,
  earnedAmount
}: StakingModalProps) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useMasterChefContract()
  const stakingContractv2 = useMasterChefV2Contract()

  async function onClaimReward() {
    if (chefVersion == 0) {
      if (stakingContract && stakedAmount) {
        try {
          setAttempting(true)
          const response: TransactionResponse = await stakingContract.harvest(poolId)
          addTransaction(response, {
            summary: t('earn.claimAccumulated')
          })
          setHash(response.hash)
        } catch (error) {
          setAttempting(false)
          console.log(error)
        }
      }
    } else if (stakingContractv2 && stakedAmount) {
      try {
        setAttempting(true)
        const response: TransactionResponse = await stakingContractv2.harvest(poolId, account)
        addTransaction(response, {
          summary: t('earn.claimAccumulated')
        })
        setHash(response.hash)
      } catch (error) {
        setAttempting(false)
        console.log(error)
      }
    }
  }

  let error: string | undefined
  if (!account) {
    error = t('earn.connectWallet')
  } else if (!stakedAmount) {
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
          {earnedAmount?.greaterThan(BIG_INT_ZERO) && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {earnedAmount?.toSignificant(6)}
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
                        {amount?.toSignificant(6)}
                      </TYPE.body>
                      <TYPE.body>
                        {'Unclaimed'} {token.symbol}
                      </TYPE.body>
                    </AutoColumn>
                  ))}
              </AutoRow>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>{t('earn.liquidityRemainsPool')}</TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakedAmount} onClick={onClaimReward}>
            {error ?? t('earn.claim')}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>{t('earn.claimingPng', { amount: earnedAmount?.toSignificant(6) })}</TYPE.body>
            {chefVersion == 1 && (earnedNonTriRewards?.length > 0 || noTriRewards) && (
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
