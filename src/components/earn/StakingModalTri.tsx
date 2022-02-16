import React, { useState, useCallback } from 'react'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonConfirmed, ButtonError } from '../Button'
import ProgressCircles from '../ProgressSteps'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { TokenAmount, Pair, ChainId } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { usePairContract, useStakingContract } from '../../hooks/useContract'
import { useMasterChefContract, useMasterChefV2Contract } from '../../state/stake/hooks-sushi'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { useDerivedStakeInfo } from '../../state/stake/hooks'
import { StakingTri } from '../../state/stake/stake-constants'
import { wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'
import { useTranslation } from 'react-i18next'
import { parseUnits } from '@ethersproject/units'
import useTLP from '../../hooks/useTLP'
import BalanceButtonValueEnum from '../BalanceButton/BalanceButtonValueEnum'
import { divideCurrencyAmountByNumber } from '../../utils'

const HypotheticalRewardRate = styled.div<{ dim: boolean }>`
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  padding-left: 20px;

  opacity: ${({ dim }) => (dim ? 0.5 : 1)};
`

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingTri
  userLiquidityUnstaked: TokenAmount | undefined
}

export default function StakingModal({ isOpen, onDismiss, stakingInfo, userLiquidityUnstaked }: StakingModalProps) {
  const { account, chainId, library } = useActiveWeb3React()

  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(
    typedValue,
    stakingInfo?.stakedAmount!.token,
    userLiquidityUnstaked
  )

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
    new TokenAmount(stakingInfo.tokens[0], '0'),
    new TokenAmount(stakingInfo.tokens[1], '0'),
    chainId ? chainId : ChainId.POLYGON
  )
  const lpToken = useTLP({
    lpAddress: stakingInfo.lpAddress,
    token0: stakingInfo.tokens[0],
    token1: stakingInfo.tokens[1]
  })

  // approval data for stake
  const deadline = useTransactionDeadline()
  const { t } = useTranslation()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmount, stakingInfo.stakingRewardAddress)

  const stakingContract = useMasterChefContract()
  const stakingContractv2 = useMasterChefV2Contract()

  async function onStake() {
    setAttempting(true)
    if (stakingInfo.chefVersion == 0) {
      if (stakingContract && parsedAmount && deadline) {
        await stakingContract
          .deposit(stakingInfo.poolId, parseUnits(typedValue))
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
          .deposit(stakingInfo.poolId, parseUnits(typedValue), account)
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
  const maxAmountInput = maxAmountSpend(userLiquidityUnstaked)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const atHalfAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput.divide('2')))
  const handleMax = useCallback(
    value => {
      maxAmountInput &&
        onUserInput(
          (value === BalanceButtonValueEnum.MAX
            ? maxAmountInput
            : divideCurrencyAmountByNumber(maxAmountInput, 2)
          )?.toExact() ?? ''
        )
    },
    [maxAmountInput, onUserInput]
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
          />

          {/* <HypotheticalRewardRate dim={!hypotheticalRewardRate.greaterThan('0')}>
            <div>
              <TYPE.black fontWeight={600}>{t('earn.weeklyRewards')}</TYPE.black>
            </div>

            <TYPE.black>
              {hypotheticalRewardRate.multiply((60 * 60 * 24 * 7).toString()).toSignificant(4, { groupSeparator: ',' })}{' '}
              {t('earn.pngWeek')}
            </TYPE.black>
          </HypotheticalRewardRate> */}

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
