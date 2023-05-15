import React, { useState, useCallback } from 'react'
import useTransactionDeadline from '../../../hooks/useTransactionDeadline'
import Modal from '../../Modal'
import { AutoColumn } from '../../Column'
import styled from 'styled-components'
import { RowBetween } from '../../Row'
import { TYPE, CloseIcon } from '../../../theme'
import { ButtonConfirmed, ButtonError } from '../../Button'
import ProgressCircles from '../../ProgressSteps'
import CurrencyInputPanel from '../../CurrencyInputPanel'
import { TokenAmount, Pair, ChainId, Token } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../../hooks'
import { useMasterChefContract, useMasterChefV2Contract } from '../../../state/stake/hooks-sushi'
import { useApproveCallback, ApprovalState } from '../../../hooks/useApproveCallback'
import { useDerivedStakeInfo } from '../../../state/stake/hooks'
import { ChefVersions } from '../../../state/stake/stake-constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../../ModalViews'
import { useTranslation } from 'react-i18next'
import { parseUnits } from '@ethersproject/units'
import useTLP from '../../../hooks/useTLP'
import useCurrencyInputPanel from '../../CurrencyInputPanel/useCurrencyInputPanel'
import { getPairRenderOrder } from '../../../utils/pools'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  userLiquidityUnstaked: TokenAmount | undefined
  stakedToken: Token
  tokens: Token[]
  lpAddress: string
  chefVersion: ChefVersions
  stakingRewardAddress: string
  poolId: number
}

export default function StakingModal({
  isOpen,
  onDismiss,
  userLiquidityUnstaked,
  stakedToken,
  tokens,
  lpAddress,
  chefVersion,
  stakingRewardAddress,
  poolId
}: StakingModalProps) {
  const { account, chainId } = useActiveWeb3React()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakedToken, userLiquidityUnstaked)

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }, [onDismiss])

  // pair contract for this token to be staked
  const dummyPair = new Pair(
    new TokenAmount(tokens[0], '0'),
    new TokenAmount(tokens[1], '0'),
    chainId ? chainId : ChainId.POLYGON
  )
  const lpToken = useTLP({
    lpAddress: lpAddress,
    token0: tokens[0],
    token1: tokens[1]
  })

  const { tokens: orderedTokens } = getPairRenderOrder(tokens)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmount, stakingRewardAddress)

  const stakingContract = useMasterChefContract()
  const stakingContractv2 = useMasterChefV2Contract()

  async function onStake() {
    setAttempting(true)
    if (chefVersion == 0) {
      if (stakingContract && parsedAmount && deadline) {
        await stakingContract
          .deposit(poolId, parseUnits(typedValue))
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    } else {
      if (stakingContractv2 && parsedAmount && deadline) {
        await stakingContractv2
          .deposit(poolId, parseUnits(typedValue), account)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t('earn.depositLiquidity')
            })
            setHash(response.hash)
          })
          .catch((error: any) => {
            setAttempting(false)
            console.log(error)
          })
      } else {
        setAttempting(false)
        throw new Error(t('earn.attemptingToStakeError'))
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const { getMaxInputAmount } = useCurrencyInputPanel()

  const { atHalfAmount, atMaxAmount, getClickedAmount } = getMaxInputAmount({
    amount: userLiquidityUnstaked,
    parsedAmount
  })

  const handleMax = useCallback(
    (value: any) => {
      const amount = getClickedAmount(value)
      onUserInput(amount)
    },
    [getClickedAmount, onUserInput]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>{t('earn.deposit')}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onClickBalanceButton={handleMax}
            disableHalfButton={atHalfAmount}
            disableMaxButton={atMaxAmount}
            currency={lpToken}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            customBalanceText={t('earn.availableToDeposit')}
            id="stake-liquidity-token"
            tokens={orderedTokens}
          />
          <RowBetween>
            <ButtonConfirmed
              mr="0.5rem"
              onClick={approveCallback}
              confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
              disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
            >
              {t('earn.approve')}
            </ButtonConfirmed>
            <ButtonError
              disabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
              error={!!error && !!parsedAmount}
              onClick={onStake}
            >
              {error ?? t('earn.deposit')}
            </ButtonError>
          </RowBetween>
          <ProgressCircles steps={[approval === ApprovalState.APPROVED || signatureData !== null]} disabled={true} />
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.depositingLiquidity')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{parsedAmount?.toSignificant(4)} TLP</TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{t('earn.transactionSubmitted')}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>
              {t('earn.deposited')} {parsedAmount?.toSignificant(4)} TLP
            </TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
