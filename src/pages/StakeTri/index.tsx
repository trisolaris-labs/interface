import { ChainId, JSBI, } from '@trisolaris/sdk'
import React, { useContext, useState, useEffect } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import { TRI, XTRI } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useApproveCallback } from '../../hooks/useApproveCallback'
import { tryParseAmount } from '../../state/swap/hooks'
import { TYPE } from '../../theme'
import { ClickableText } from '../Pool/styleds'
import { useTranslation } from 'react-i18next'
import { useTokenBalance } from '../../state/wallet/hooks'
import { DataCard, CardBGImage, CardNoise, CardSection } from '../../components/earn/styled'
import StakeInputPanel from './StakeInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import useTriBar from '../../state/stakeTri/hooks'
import StakeTriDataCard from './StakeTriDataCard'

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

  const { chainId: _chainId, account } = useActiveWeb3React()
  const walletConnected = !!account
  const chainId = _chainId ? _chainId! : ChainId.AURORA

  const [stakeState, setStakeState] = useState<StakeState>(StakeState.stakeTRI);
  const [input, setInput] = useState<string>('')
  const [usingBalance, setUsingBalance] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const { enter, leave } = useTriBar();

  const isStaking = stakeState === StakeState.stakeTRI;

  const triBalance = useTokenBalance(account ?? undefined, TRI[chainId])!
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[chainId])!

  const balance = isStaking ? triBalance : xTriBalance;
  const parsedAmount = usingBalance ? balance : tryParseAmount(input, balance?.currency)

  const [approvalState, approve] = useApproveCallback(parsedAmount, XTRI[chainId].address)

  const insufficientFunds = (balance && balance.equalTo(JSBI.BigInt(0))) || parsedAmount?.greaterThan(balance)
  const formattedBalance = balance?.toSignificant(4);
  const inputError = insufficientFunds;

  // Reset input when toggling staking/unstaking
  useEffect(() => {
    setInput('');
  }, [isStaking, setInput]);

  function handleInput(v: string) {
    if (v.length <= INPUT_CHAR_LIMIT) {
      setUsingBalance(false)
      setInput(v)
    }
  }

  function handleClickMax() {
    setInput(parsedAmount ? parsedAmount.toSignificant(balance.currency.decimals).substring(0, INPUT_CHAR_LIMIT) : '')
    setUsingBalance(true)
  }

  const buttonDisabled = !input || pendingTx || insufficientFunds || (parsedAmount && parsedAmount.equalTo(JSBI.BigInt(0)))

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
          <StakeTriDataCard label="APR">XX</StakeTriDataCard>
          <StakeTriDataCard label="Balance xTRI">XX%</StakeTriDataCard>
          <StakeTriDataCard label="Unstaked TRI">
            <Row align="center" justifyContent="start">
              <CurrencyLogo currency={TRI[chainId]} size={'20px'} style={{ marginRight: '10px' }} />
              <TYPE.black fontWeight={400}>XX</TYPE.black>
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
              onUserInput={handleInput}
              currency={isStaking ? TRI[chainId] : XTRI[chainId]}
              id="stake-currency-input"
              onMax={handleClickMax}
            />
          </AutoColumn>
        </LightCard>
      </AutoColumn>
    </PageWrapper>
  )
}