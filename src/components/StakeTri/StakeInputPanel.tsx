import { Currency } from '@trisolaris/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
  cursor: pointer;
  color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg3};
  z-index: 1;
`

const Container = styled.div`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.bg3};
  background-color: ${({ theme }) => theme.bg3};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
  border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
  border: 1px solid ${({ theme }) => theme.primary1};
  outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-right: 0.5rem;
  `};
`

interface StakeInputPanelProps {
  currency?: Currency | null
  hideInput?: boolean
  id: string
  showMaxButton: boolean
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
}

export default function StakeInputPanel({
  currency,
  id,
  showMaxButton,
  value,
  onMax,
  onUserInput,
}: StakeInputPanelProps) {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container>
        <LabelRow>
          <RowBetween>
            {account ? (
              <TYPE.body
                onClick={onMax}
                color={theme.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {!!currency && selectedCurrencyBalance
                  ? (t('currencyInputPanel.balance')) + selectedCurrencyBalance?.toSignificant(6)
                  : ' -'}
              </TYPE.body>
            ) : null}
          </RowBetween>
        </LabelRow>
        <InputRow selected={true}>
          <NumericalInput
            className="token-amount-input"
            value={value}
            onUserInput={val => {
              onUserInput(val)
            }}
          />
          {account && currency && showMaxButton
            ? (
              <StyledBalanceMax onClick={onMax}>
                {t('currencyInputPanel.max')}
              </StyledBalanceMax>
            )
            : null
          }
          <div>
            <Aligner>
              <CurrencyLogo currency={currency!} size={'24px'} />
              <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                  '...' +
                  currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || t('currencyInputPanel.selectToken')}
              </StyledTokenName>
            </Aligner>
          </div>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
