import { ChainId, JSBI, } from '@trisolaris/sdk'
import React, { useContext, useState, useEffect } from 'react'
import { Text } from 'rebass'
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
import { useTranslation } from 'react-i18next'
import { useTokenBalance } from '../../state/wallet/hooks'
import { DataCard, CardBGImage, CardNoise, CardSection } from '../../components/earn/styled'
import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import useTriBar from '../../state/stakeTri/hooks'
import StakeTriDataCard from '../../components/StakeTri/StakeTriDataCard'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Dots } from '../../components/swap/styleds'

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

enum StakeState {
  stakeTRI = 'stakeTRI',
  unstakeXTRI = 'unstakeXTRI',
}

const INPUT_CHAR_LIMIT = 18;

export default function StakeTri() {
  const { t } = useTranslation()
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

  // @TODO ADD TRIBAR ADDRESS
  const TRIBAR_ADDRESS = '0x0000000000000000000000000000000000000000';

  const [approvalState, handleApproval] = useApproveCallback(parsedAmount, TRIBAR_ADDRESS);

  // Reset input when toggling staking/unstaking
  useEffect(() => {
    setInput('');
  }, [isStaking, setInput]);

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT);

    setUsingBalance(false);
    _setInput(value);
  }

  function handleClickMax() {
    setInput(parsedAmount?.toSignificant(Math.min(balance.currency.decimals, INPUT_CHAR_LIMIT)) ?? '')
    setUsingBalance(true)
  }

  // Flow
  // 1)   Connect Wallet
  // 2)   Check for sufficient funds
  // 3)   Approve
  // 3a)  Approval Pending
  // 4)   Stake/Unstake
  function buttonRenderer() {
    // If no wallet, show connect wallet
    if (account == null) {
      return (
        <ButtonLight onClick={toggleWalletModal}>
          Connect Wallet
        </ButtonLight>
      );
    }

    // If input does not have value
    if (parsedAmount?.greaterThan(JSBI.BigInt(0)) !== true) {
      return (
        <ButtonPrimary disabled={true}>
          Enter an amount
        </ButtonPrimary>
      );
    }

    // If account balance is less than inputted amount
    // This flow should be _before_ approval flow
    const insufficientFunds = (
      (balance?.equalTo(JSBI.BigInt(0)) ?? false) ||
      parsedAmount?.greaterThan(balance)
    )
    if (insufficientFunds) {
      return (
        <ButtonError error={true} disabled={true}>
          Insufficient Balance
        </ButtonError>
      );
    }

    // If unapproved, render button approval flow
    // Approval is only needed for staking
    const shouldSeekApproval = (
      isStaking &&
      approvalState !== ApprovalState.APPROVED &&
      parsedAmount?.greaterThan(JSBI.BigInt(0))
    );
    if (shouldSeekApproval) {
      if (ApprovalState.NOT_APPROVED) {
        return (
          <ButtonPrimary onClick={handleApproval}>
            Approve
          </ButtonPrimary>
        );
      }

      if (ApprovalState.PENDING) {
        return (
          <ButtonPrimary disabled={true} onClick={handleApproval}>
            <Dots>Approving</Dots>
          </ButtonPrimary>
        );
      }
    }

    // Attempt the (un)staking transaction
    return (
      <ButtonPrimary
        disabled={pendingTx}
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

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Earn more TRI</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>For every swap on the exchange on every chain, XX% of the swap fees are distributed as TRI
                  proportional to your share of the TriBar. When your TRI is staked into the TriBar, you receive
                  xTRI in return for voting rights and a fully composable token that can interact with other protocols.
                  Your xTRI is continuously compounding, when you unstake you will receive all the originally deposited
                  TRI and any additional from fees.</TYPE.white>
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

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline', gap: '10px' }}>
          <StakeTriDataCard label="APR">XX%</StakeTriDataCard>
          <StakeTriDataCard label="Balance xTRI">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={XTRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{xTriBalance?.toSignificant(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
          <StakeTriDataCard label="Unstaked TRI">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>{triBalance?.toSignificant(4) ?? 0}</TYPE.black>
            </Row>
          </StakeTriDataCard>
        </DataRow>
      </AutoColumn>

      <AutoColumn style={{ width: '100%' }}>
        <LightCard>
          <AutoColumn gap="20px">
            <RowBetween>
              <AutoColumn gap="20px" justify="start">
                <Text fontWeight={500}>{isStaking ? 'Stake TRI' : 'Unstake xTRI'}</Text>
              </AutoColumn>
              <AutoColumn gap="20px">
                <RowBetween>
                  <StakeClickableText
                    selected={isStaking}
                    style={{ paddingRight: '10px' }}
                    onClick={() => setStakeState(StakeState.stakeTRI)}
                  >
                    Stake
                  </StakeClickableText>
                  <StakeClickableText
                    selected={!isStaking}
                    onClick={() => setStakeState(StakeState.unstakeXTRI)}
                  >
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
              onMax={handleClickMax}
            />
          </AutoColumn>
          <div style={{ marginTop: '1rem' }}>
            {buttonRenderer()}
          </div>
        </LightCard>
      </AutoColumn>
    </PageWrapper>
  )
}