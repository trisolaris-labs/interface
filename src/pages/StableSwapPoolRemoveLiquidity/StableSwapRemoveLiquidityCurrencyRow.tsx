import React from 'react'
import { Currency } from '@trisolaris/sdk'

import { Input as NumericalInput } from '../../components/NumericalInput'
import { useTranslation } from 'react-i18next'

import { InputRow, Aligner, InputPanel, Container, StyledTokenName } from './StableSwapPoolRemoveLiquidity.styles'
import CurrencyLogo from '../../components/CurrencyLogo'
import _ from 'lodash'

type Props = {
  currency: Currency
  value: string
  index: number
}

export default function StableSwapRemoveCurrencyRow({ currency, value, index }: Props) {
  const { t } = useTranslation()

  return (
    <InputPanel id={`remove-liquidity-input-token${['a', 'b', 'c'][index]}`}>
      <Container>
        <InputRow selected={true}>
          <NumericalInput className="token-amount-input" value={value} onUserInput={_.identity} />

          <div>
            <Aligner>
              <CurrencyLogo currency={currency} size={'24px'} />
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
