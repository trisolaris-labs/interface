import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Currency } from '@trisolaris/sdk'

import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { Props as BalanceButtonProps } from '../BalanceButton'

import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'

import { TYPE } from '../../theme'

import {
  InputRow,
  LabelRow,
  Aligner,
  InputPanel,
  Container,
  StyledTokenName,
  StyledBalanceButton
} from './StakeInputPanel.styles'

interface StakeInputPanelProps {
  currency?: Currency | null
  hideInput?: boolean
  id: string
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
}

export default function StakeInputPanel({
  currency,
  id,
  value,
  onMax,
  onUserInput,
  disableMaxButton,
  disableHalfButton,
  onClickBalanceButton
}: StakeInputPanelProps & BalanceButtonProps) {
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
                  ? t('currencyInputPanel.balance') + selectedCurrencyBalance?.toSignificant(6)
                  : ' -'}
              </TYPE.body>
            ) : null}
            {account && currency ? (
              <StyledBalanceButton
                disableHalfButton={disableHalfButton}
                disableMaxButton={disableMaxButton}
                onClickBalanceButton={onClickBalanceButton}
              />
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
