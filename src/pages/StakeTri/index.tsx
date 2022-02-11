import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { ChainId, CurrencyAmount, Percent, TokenAmount } from '@trisolaris/sdk'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import StakeTriDataCard from '../../components/StakeTri/StakeTriDataCard'
import { DarkGreyCard, LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { Dots } from '../../components/swap/styleds'
import Slider from '../../components/Slider'

import StakingAPRCard from './StakingAPRCard'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../state/swap/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTriBar, useTriBarStats } from '../../state/stakeTri/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'

import { PageWrapper } from '../../components/Page'

import { maxAmountSpend } from '../../utils/maxAmountSpend'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'

import { TRI, XTRI, BIG_INT_ZERO } from '../../constants'
import { TYPE } from '../../theme'
import { ClickableText, MaxButton } from '../Pool/styleds'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import { dummyToken } from '../../state/stake/stake-constants'

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

const dummyAmount = new TokenAmount(dummyToken, '0')

export default function StakeTri() {
  const { t } = useTranslation()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const { chainId: _chainId, account } = useActiveWeb3React()
  const chainId = _chainId ? _chainId! : ChainId.AURORA

  const [stakeState, setStakeState] = useState<StakeState>(StakeState.stakeTRI)
  const [input, _setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const { enter, leave } = useTriBar()

  const isStaking = stakeState === StakeState.stakeTRI

  const triBalance = useTokenBalance(account ?? undefined, TRI[chainId])!
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[chainId])!

  // const balance = isStaking ? triBalance : xTriBalance
  const tempBalance = isStaking ? triBalance : xTriBalance
  const balance = tempBalance ?? dummyAmount
  // const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [percentage, setPercentage] = useState<number>(0)

  const [debouncedPercentage, setDebouncedPercentage] = useDebouncedChangeHandler(percentage, setPercentage)

  const handleSliderChange = (e: number) => {
    setDebouncedPercentage(e)
  }

  const percent = new Percent(percentage.toFixed(0), '100')

  const testToken = balance ? wrappedCurrency(balance.currency, chainId)! : dummyToken

  const testAmount = balance ? new TokenAmount(testToken, percent.multiply(balance.raw).quotient) : dummyAmount

  const parsedAmount = testAmount

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

    setUsingBalance(false)
    _setInput(value)
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(balance)
  // const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount.equalTo(maxAmountInput))

  const handleClickMax = useCallback(() => {
    if (maxAmountInput) {
      setInput(maxAmountInput.toExact())
      setUsingBalance(true)
    }
  }, [maxAmountInput, setInput])

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
    // const insufficientFunds = (balance?.equalTo(BIG_INT_ZERO) ?? false) || parsedAmount?.greaterThan(balance)
    const insufficientFunds = (balance?.equalTo(BIG_INT_ZERO) ?? false) || parsedAmount.greaterThan(balance)
    if (insufficientFunds) {
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
      // parsedAmount?.greaterThan(BIG_INT_ZERO) === true
      parsedAmount.greaterThan(BIG_INT_ZERO) === true

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

  // const percentToRemove = new Percent(input, '100')

  // useEffect(() => {
  //   // console.log(percentage)
  //   // console.log(new Percent(percentage.toFixed(0), '100'))
  //   const percent = new Percent(percentage.toFixed(0), '100')

  //   const testToken = balance ? wrappedCurrency(balance.currency, chainId)! : dummyToken

  //   const dummyAmount = new TokenAmount(dummyToken, '0')
  //   const test = balance ? new TokenAmount(testToken, percent.multiply(balance.raw).quotient) : dummyAmount
  //   console.log(test.toFixed(6))
  // }, [percentage])

  return (
    <PageWrapper gap="lg" justify="center">
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

            <Row style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text fontSize={72} fontWeight={500}>
                {percentage.toFixed(0)}%
              </Text>
            </Row>

            <Slider value={debouncedPercentage} onChange={handleSliderChange} />

            <RowBetween style={{ justifyContent: 'space-evenly' }}>
              <MaxButton onClick={() => setPercentage(25)} width="20%">
                25%
              </MaxButton>
              <MaxButton onClick={() => setPercentage(50)} width="20%">
                50%
              </MaxButton>
              <MaxButton onClick={() => setPercentage(75)} width="20%">
                75%
              </MaxButton>
              <MaxButton onClick={() => setPercentage(100)} width="20%">
                {/*TODO: Translate using i18n entry from removeLiquidity object*/}
                {t('currencyInputPanel.max')}
              </MaxButton>
            </RowBetween>

            <StakeInputPanel
              value={testAmount.toFixed(5)}
              onUserInput={setInput}
              showMaxButton={false}
              currency={isStaking ? TRI[chainId] : XTRI[chainId]}
              id="stake-currency-input"
              onMax={handleClickMax}
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
