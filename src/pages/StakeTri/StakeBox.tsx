import React, { useState, useCallback, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { ChainId, CurrencyAmount, TokenAmount } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../hooks'

import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import ApproveButton from '../../components/ApproveButton'
import StakeButton from './StakeButton'
import Toggle from '../../components/Toggle'
import { RowBetween, RowFixed } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../../components/TransactionConfirmationModal'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Text } from 'rebass'
import MultipleCurrencyLogo from '../../components/MultipleCurrencyLogo'

import { tryParseAmount } from '../../state/stableswap/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { usePTriContract } from '../../hooks/useContract'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import { usePtriStakeInfo } from '../../hooks/usePtri'

import { PTRI, TRI } from '../../constants/tokens'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'
import { TYPE } from '../../theme'
import { BIG_INT_ZERO } from '../../constants'
import { STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { DarkGreyCard } from '../../components/Card'
import { useWalletModalToggle } from '../../state/application/hooks'

const INPUT_CHAR_LIMIT = 18

const threePool = STABLESWAP_POOLS.USDC_USDT_USN

function StakeBox() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const pTriContract = usePTriContract()
  const addTransaction = useTransactionAdder()
  const { getMaxInputAmount } = useCurrencyInputPanel()
  const { userClaimableRewards } = usePtriStakeInfo()
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const triBalance = useTokenBalance(account ?? undefined, TRI[ChainId.AURORA])
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])

  const [input, _setInput] = useState<string>('')
  const [pendingTx, setPendingTx] = useState(false)
  const [isStaking, setIsStaking] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [txHash, setTxHash] = useState<string | undefined>('')
  const [error, setError] = useState<any>(null)

  const balance = (isStaking ? triBalance : pTriBalance) ?? new TokenAmount(TRI[ChainId.AURORA], '0')

  const parsedAmount = tryParseAmount(input, balance?.currency)

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, PTRI[ChainId.AURORA].address)

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT)
    _setInput(value)
  }

  const handleBalanceClick = (value: BalanceButtonValueEnum) => {
    const amount = getClickedAmount(value)
    _setInput(amount)
  }

  const { atMaxAmount: atMaxAmountInput, atHalfAmount: atHalfAmountInput, getClickedAmount } = getMaxInputAmount({
    amount: balance,
    parsedAmount: parsedAmount
  })

  const depositAndWithdraw = useCallback(
    async (amount: CurrencyAmount | undefined) => {
      if (amount?.raw) {
        const call = isStaking ? 'deposit' : 'withdraw'
        try {
          const tx = await pTriContract?.[call](amount?.raw.toString())
          setTxHash(tx.hash)
          addTransaction(tx, { summary: `${isStaking ? 'Deposited into' : 'Withdraw'} pTRI` })
          return tx
        } catch (error) {
          if ((error as any)?.code === 4001) {
            throw new Error('Transaction rejected.')
          } else {
            console.error(`${call} failed`, error, call)
            throw new Error(`${call} failed: ${(error as any).message}`)
          }
        }
      }
    },
    [addTransaction, pTriContract, isStaking]
  )

  async function handleStakeAndUnstake() {
    try {
      setPendingTx(true)
      await depositAndWithdraw(parsedAmount)
      setInput('')
    } catch (e) {
      setError(e)
      console.error(`Error ${isStaking ? 'Staking' : 'Unstaking'}: `, e)
    } finally {
      setPendingTx(false)
    }
  }

  function handleStakeToggle() {
    setIsStaking(!isStaking)
    setInput('')
  }

  function onStakeClick() {
    setTxHash(undefined)
    setError(null)
    setOpenModal(true)
  }

  function confirmationHeader() {
    return isStaking ? (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <TYPE.mediumHeader fontWeight={500} justifySelf="center">
          Depositing
        </TYPE.mediumHeader>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={TRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500}>
              {parsedAmount?.toFixed(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {TRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>
          <TYPE.mediumHeader fontWeight={500}>You will receive</TYPE.mediumHeader>
        </RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={PTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500} color={theme.primary1}>
              {parsedAmount?.toFixed(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {PTRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    ) : (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <TYPE.mediumHeader fontWeight={500} justifySelf="center">
          Withdrawing
        </TYPE.mediumHeader>
        <TYPE.mediumHeader fontWeight={500}>Deposits in pTRI</TYPE.mediumHeader>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={PTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500} marginLeft={10}>
              {parsedAmount?.toFixed(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {PTRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <TYPE.mediumHeader fontWeight={500}>Unclaimed rewards</TYPE.mediumHeader>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <MultipleCurrencyLogo currencies={threePool.poolTokens} size={24} separation={14} />
            <Text fontSize={24} fontWeight={500} marginLeft={10}>
              {userClaimableRewards?.toFixed(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {threePool.lpToken.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    )
  }

  function confirmationBottom() {
    return (
      <>
        <TYPE.italic fontSize={14} color={theme.text2} textAlign="left" padding={'12px 0 0 0'}>
          By staking into pTRI you will get rewards in USDC-USDT-USN tokens, which you can then stake for more revenue.
        </TYPE.italic>
        <ButtonPrimary disabled={pendingTx} onClick={() => handleStakeAndUnstake()} fontSize={16} marginTop={20}>
          {isStaking ? 'Confirm Stake' : 'Confirm Unstake'}
        </ButtonPrimary>
      </>
    )
  }

  function modalContent() {
    return error ? (
      <TransactionErrorContent onDismiss={() => setOpenModal(false)} message={error.message} />
    ) : (
      <ConfirmationModalContent
        title={isStaking ? 'Stake TRI' : 'Unstake pTRI'}
        onDismiss={() => setOpenModal(false)}
        topContent={confirmationHeader}
        bottomContent={confirmationBottom}
      />
    )
  }

  return (
    <div>
      <TransactionConfirmationModal
        isOpen={openModal}
        onDismiss={() => setOpenModal(false)}
        attemptingTxn={pendingTx}
        hash={txHash}
        content={modalContent}
        pendingText={isStaking ? 'Staking into pTRI' : 'Withdrawing from pTRI staking'}
      />
      <AutoColumn style={{ width: '100%' }}>
        <DarkGreyCard>
          <AutoColumn gap="20px">
            <RowBetween marginBottom={10}>
              <AutoColumn gap="20px" justify="start">
                <TYPE.mediumHeader>{isStaking ? 'Stake TRI' : 'Unstake pTRI'}</TYPE.mediumHeader>
              </AutoColumn>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Toggle
                    id="toggle-staking"
                    isActive={isStaking}
                    toggle={handleStakeToggle}
                    customToggleText={{ on: 'Stake', off: 'Unstake' }}
                    fontSize="14px"
                  />
                </RowBetween>
              </AutoColumn>
            </RowBetween>

            <StakeInputPanel
              value={input}
              onUserInput={setInput}
              currency={isStaking ? TRI[ChainId.AURORA] : PTRI[ChainId.AURORA]}
              id="stake-currency-input"
              onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
              onClickBalanceButton={handleBalanceClick}
              disableMaxButton={atMaxAmountInput || !balance?.greaterThan(BIG_INT_ZERO)}
              disableHalfButton={atHalfAmountInput || !balance?.greaterThan(BIG_INT_ZERO)}
            />
          </AutoColumn>
          <div style={{ marginTop: '1rem' }}>
            {account == null ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <RowBetween>
                {approvalState !== ApprovalState.APPROVED &&
                  approvalState !== ApprovalState.UNKNOWN &&
                  isStaking &&
                  input && <ApproveButton approvalState={approvalState} handleApproval={handleApproval} />}
                <StakeButton
                  balance={balance}
                  stakingAmount={parsedAmount}
                  approvalState={approvalState}
                  isStaking={isStaking}
                  pendingTx={pendingTx}
                  handleStakeAndUnstake={onStakeClick}
                />
              </RowBetween>
            )}
          </div>
        </DarkGreyCard>
      </AutoColumn>
    </div>
  )
}

export default StakeBox
