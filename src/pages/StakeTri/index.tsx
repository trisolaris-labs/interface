import { ChainId, CurrencyAmount, JSBI } from '@trisolaris/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import { TRI, XTRI } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../state/swap/hooks'
import { TYPE } from '../../theme'
import { ClickableText } from '../Pool/styleds'
import { useTokenBalance } from '../../state/wallet/hooks'
import { DataCard, CardBGImage, CardNoise, CardSection } from '../../components/earn/styled'
import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useTriBar, useTriBarStats } from '../../state/stakeTri/hooks'
import StakeTriDataCard from '../../components/StakeTri/StakeTriDataCard'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Dots } from '../../components/swap/styleds'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import StakingAPRCard from './StakingAPRCard'

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
   margin: 15px;
 `};
 `

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const StakeClickableText = styled(ClickableText) <{ selected: boolean }>`
  color: ${({ selected, theme }) => selected ? theme.primary1 : theme.bg5};
  font-weight: ${({ selected }) => selected ? 500 : 400};
`

const LargeHeaderWhite = styled(TYPE.largeHeader)`
  color: white;
`

enum StakeState {
  stakeTRI = 'stakeTRI',
  unstakeXTRI = 'unstakeXTRI',
}

const INPUT_CHAR_LIMIT = 18;

export default function StakeTri() {
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const { chainId: _chainId, account } = useActiveWeb3React()
  const chainId = _chainId ? _chainId! : ChainId.AURORA

  const [stakeState, setStakeState] = useState<StakeState>(StakeState.stakeTRI);
  const [input, _setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const { enter, leave } = useTriBar();

  const isStaking = stakeState === StakeState.stakeTRI;

  const triBalance = useTokenBalance(account ?? undefined, TRI[chainId])!
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[chainId])!

  const balance = isStaking ? triBalance : xTriBalance;
  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, XTRI[chainId].address);

  // Reset input when toggling staking/unstaking
  function handleStakeTRI() {
    setStakeState(StakeState.stakeTRI);
    setInput('');
  }
  function handleUnstakeXTRI() {
    setStakeState(StakeState.unstakeXTRI);
    setInput('');
  }

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT);

    setUsingBalance(false);
    _setInput(value);
  }

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(balance)
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))

  const handleClickMax = useCallback(() => {
    if (maxAmountInput) {
      setInput(maxAmountInput.toExact());
      setUsingBalance(true);
    }
  }, [maxAmountInput, setInput])

  function renderApproveButton() {
    if (!isStaking) {
      return null;
    }

    return (
      <ButtonConfirmed
        mr="0.5rem"
        onClick={handleApproval}
        confirmed={approvalState === ApprovalState.APPROVED}
        disabled={approvalState !== ApprovalState.NOT_APPROVED}
      >
        {approvalState === ApprovalState.PENDING
          ? (<Dots>Approving</Dots>)
          : approvalState === ApprovalState.APPROVED
            ? 'Approved'
            : 'Approve'}
      </ButtonConfirmed>
    )
  }

  function renderStakeButton() {
    // If input does not have value
    if (parsedAmount?.greaterThan(JSBI.BigInt(0)) !== true) {
      return (
        <ButtonPrimary disabled={true}>
          Enter an amount
        </ButtonPrimary>
      );
    }

    // If account balance is less than inputted amount
    const insufficientFunds = (balance?.equalTo(JSBI.BigInt(0)) ?? false) || parsedAmount?.greaterThan(balance);
    if (insufficientFunds) {
      return (
        <ButtonError error={true} disabled={true}>
          Insufficient Balance
        </ButtonError>
      );
    }

    // If user is unstaking, we don't need to check approval status
    const isDisabled = isStaking
      ? (approvalState !== ApprovalState.APPROVED || pendingTx)
      : pendingTx;

    return (
      <ButtonPrimary
        disabled={isDisabled}
        onClick={handleStake}
      >
        {isStaking ? 'Stake' : 'Unstake'}
      </ButtonPrimary>
    );
  }

  async function handleStake() {
    try {
      setPendingTx(true);

      if (isStaking) {
        await enter(parsedAmount);
      } else {
        await leave(parsedAmount);
      }

      setInput('');
    } catch (e) {
      console.error(`Error ${isStaking ? 'Staking' : 'Unstaking'}: `, e);
    } finally {
      setPendingTx(false);
    }
  }

  const { totalTriStaked } = useTriBarStats();
  const totalTriStakedFormatted = totalTriStaked?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <LargeHeaderWhite fontWeight={600}>Earn more TRI</LargeHeaderWhite>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  0.05% of every trade on the Trisolaris DEX
                  will be used to buy back TRI and be distributed to TRI stakers
                  proportionally based on their share of the staking pool.
                  When you stake TRI, you receive xTRI. Your xTRI is continuously compounding,
                  and when you unstake you will receive all of your originally deposited TRI
                  and additional TRI earned from fees.
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
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <TopSection gap="md">
        <StakingAPRCard />
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline', gap: '10px' }}>
          <StakeTriDataCard label="Total TRI Staked">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{totalTriStakedFormatted ?? 'Loading...'}</TYPE.black>
            </Row>
          </StakeTriDataCard>
          <StakeTriDataCard label="Balance xTRI">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={XTRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{xTriBalance?.toFixed(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
          <StakeTriDataCard label="Unstaked TRI">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{triBalance?.toFixed(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
        </DataRow>
      </AutoColumn>

      <AutoColumn style={{ width: '100%' }}>
        <LightCard>
          <AutoColumn gap="20px">
            <RowBetween>
              <AutoColumn gap="20px" justify="start">
                <TYPE.mediumHeader>{isStaking ? 'Stake TRI' : 'Unstake xTRI'}</TYPE.mediumHeader>
              </AutoColumn>
              <AutoColumn gap="20px">
                <RowBetween>
                  <StakeClickableText
                    selected={isStaking}
                    style={{ paddingRight: '10px' }}
                    onClick={handleStakeTRI}
                  >
                    Stake
                  </StakeClickableText>
                  <StakeClickableText
                    selected={!isStaking}
                    onClick={handleUnstakeXTRI}
                  >
                    Unstake
                  </StakeClickableText>
                </RowBetween>
              </AutoColumn>
            </RowBetween>
            <StakeInputPanel
              value={input!}
              onUserInput={setInput}
              showMaxButton={!atMaxAmountInput}
              currency={isStaking ? TRI[chainId] : XTRI[chainId]}
              id="stake-currency-input"
              onMax={handleClickMax}
            />
          </AutoColumn>
          <div style={{ marginTop: '1rem' }}>
            {(account == null)
              ? (
                <ButtonLight onClick={toggleWalletModal}>
                  Connect Wallet
                </ButtonLight>
              ) : (
                <RowBetween>
                  {renderApproveButton()}
                  {renderStakeButton()}
                </RowBetween>
              )}
          </div>
        </LightCard>
      </AutoColumn>
    </PageWrapper>
  )
}