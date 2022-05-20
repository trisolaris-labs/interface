import { ChainId } from '@trisolaris/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { DarkGreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import { BIG_INT_ZERO } from '../../constants'
import { TRI, XTRI } from '../../constants/tokens'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../state/swap/hooks'
import { TYPE } from '../../theme'
import { ClickableText } from '../Pool/styleds'
import { useTokenBalance } from '../../state/wallet/hooks'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useTriBar, useTriBarStats } from '../../state/stakeTri/hooks'
import StakeTriDataCard from '../../components/StakeTri/StakeTriDataCard'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Dots } from '../../components/swap/styleds'
import StakingAPRCard from './StakingAPRCard'
import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'

import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   flex-direction: column;
   margin: 15px;
 `};
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const StakeClickableText = styled(ClickableText)<{ selected: boolean }>`
  color: ${({ selected, theme }) => (selected ? theme.primary1 : theme.bg5)};
  font-weight: ${({ selected }) => (selected ? 500 : 400)};
`

const LargeHeaderWhite = styled(TYPE.largeHeader)`
  color: white;
`

enum StakeState {
  stakeTRI = 'stakeTRI',
  unstakeXTRI = 'unstakeXTRI'
}

const INPUT_CHAR_LIMIT = 18

export default function StakeTri() {
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const { chainId: _chainId, account } = useActiveWeb3React()
  const chainId = _chainId ? _chainId! : ChainId.AURORA

  const [stakeState, setStakeState] = useState<StakeState>(StakeState.stakeTRI)
  const [input, _setInput] = useState<string>('')
  const [pendingTx, setPendingTx] = useState(false)
  const { enter, leave } = useTriBar()

  const isStaking = stakeState === StakeState.stakeTRI

  const triBalance = useTokenBalance(account ?? undefined, TRI[chainId])!
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[chainId])!

  const balance = isStaking ? triBalance : xTriBalance
  const parsedAmount = tryParseAmount(input, balance?.currency)

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, XTRI[chainId].address)

  // Reset input when toggling staking/unstaking
  function handleStakeTRI() {
    setStakeState(StakeState.stakeTRI)
    setInput('')
  }
  function handleUnstakeXTRI() {
    setStakeState(StakeState.unstakeXTRI)
    setInput('')
  }

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT)
    _setInput(value)
  }

  const { getMaxInputAmount } = useCurrencyInputPanel()
  const {
    atMaxAmount: atMaxAmountInput,
    atHalfAmount: atHalfAmountInput,
    maxAmountInput,
    getClickedAmount
  } = getMaxInputAmount({
    amount: balance,
    parsedAmount: parsedAmount
  })

  const handleBalanceClick = (value: BalanceButtonValueEnum) => {
    const amount = getClickedAmount(value)
    _setInput(amount)
  }

  function renderApproveButton() {
    if (!isStaking) {
      return null
    }

    return (
      <ButtonConfirmed
        mr="0.5rem"
        onClick={handleApproval}
        confirmed={approvalState === ApprovalState.APPROVED}
        disabled={approvalState !== ApprovalState.NOT_APPROVED}
      >
        {approvalState === ApprovalState.PENDING ? (
          <Dots>Approving</Dots>
        ) : approvalState === ApprovalState.APPROVED ? (
          'Approved'
        ) : (
          'Approve'
        )}
      </ButtonConfirmed>
    )
  }

  function renderStakeButton() {
    // If account balance is less than inputted amount
    const insufficientFunds = (balance?.equalTo(BIG_INT_ZERO) ?? false) || parsedAmount?.greaterThan(balance)
    if (insufficientFunds && parsedAmount?.greaterThan(BIG_INT_ZERO)) {
      return (
        <ButtonError error={true} disabled={true}>
          Insufficient Balance
        </ButtonError>
      )
    }

    const isValid =
      // If user is unstaking, we don't need to check approval status
      (isStaking ? approvalState === ApprovalState.APPROVED : true) &&
      !pendingTx &&
      parsedAmount?.greaterThan(BIG_INT_ZERO) === true

    return (
      <ButtonPrimary disabled={!isValid} onClick={handleStake}>
        {isStaking ? 'Stake' : 'Unstake'}
      </ButtonPrimary>
    )
  }

  async function handleStake() {
    try {
      setPendingTx(true)

      if (isStaking) {
        await enter(parsedAmount)
      } else {
        await leave(parsedAmount)
      }

      setInput('')
    } catch (e) {
      console.error(`Error ${isStaking ? 'Staking' : 'Unstaking'}: `, e)
    } finally {
      setPendingTx(false)
    }
  }

  const { totalTriStaked } = useTriBarStats()
  const totalTriStakedFormatted = totalTriStaked?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <PageWrapper gap="lg" justify="center">
      <StakeBox />
      <TopSection gap="md">
        <HighlightCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <LargeHeaderWhite fontWeight={600}>Earn more TRI</LargeHeaderWhite>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  0.05% of every trade on the Trisolaris DEX will be used to buy back TRI and be distributed to TRI
                  stakers proportionally based on their share of the staking pool. When you stake TRI, you receive xTRI.
                  Your xTRI is continuously compounding, and when you unstake you will receive all of your originally
                  deposited TRI and additional TRI earned from fees.
                </TYPE.white>
              </RowBetween>{' '}
              {/* @TODO ADD LINK */}
              {/* <ExternalLink
                    style={{ color: 'white', textDecoration: 'underline' }}
                    href="https://medium.com/trisolaris-labs"
                    target="_blank"
                  >
                    <TYPE.white fontSize={14}>{t('earnPage.readMoreAboutPng')}</TYPE.white>
                  </ExternalLink> */}
            </AutoColumn>
          </CardSection>
        </HighlightCard>
      </TopSection>

      <TopSection gap="md">
        <StakingAPRCard />
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ gap: '10px', margin: 0 }}>
          <StakeTriDataCard label="Total TRI Staked">
            <Row align="center" justifyContent="center">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{totalTriStakedFormatted ?? 'Loading...'}</TYPE.black>
            </Row>
          </StakeTriDataCard>
          <StakeTriDataCard label="Balance xTRI">
            <Row align="center" justifyContent="center">
              <CurrencyLogo currency={XTRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{xTriBalance?.toFixed(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
          <StakeTriDataCard label="Unstaked TRI">
            <Row align="center" justifyContent="center">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{triBalance?.toFixed(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
        </DataRow>
      </AutoColumn>

      <AutoColumn style={{ width: '100%' }}>
        <DarkGreyCard>
          <AutoColumn gap="20px">
            <RowBetween>
              <AutoColumn gap="20px" justify="start">
                <TYPE.mediumHeader>{isStaking ? 'Stake TRI' : 'Unstake xTRI'}</TYPE.mediumHeader>
              </AutoColumn>
              <AutoColumn gap="20px">
                <RowBetween>
                  <StakeClickableText selected={isStaking} style={{ paddingRight: '10px' }} onClick={handleStakeTRI}>
                    Stake
                  </StakeClickableText>
                  <StakeClickableText selected={!isStaking} onClick={handleUnstakeXTRI}>
                    Unstake
                  </StakeClickableText>
                </RowBetween>
              </AutoColumn>
            </RowBetween>

            <StakeInputPanel
              value={input!}
              onUserInput={setInput}
              currency={isStaking ? TRI[chainId] : XTRI[chainId]}
              id="stake-currency-input"
              onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
              onClickBalanceButton={handleBalanceClick}
              disableMaxButton={atMaxAmountInput}
              disableHalfButton={atHalfAmountInput}
            />
          </AutoColumn>
          <div style={{ marginTop: '1rem' }}>
            {account == null ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <RowBetween>
                {renderApproveButton()}
                {renderStakeButton()}
              </RowBetween>
            )}
          </div>
        </DarkGreyCard>
      </AutoColumn>
    </PageWrapper>
  )
}
