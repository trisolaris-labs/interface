import { Currency } from '@trisolaris/sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface MultipleLogoProps {
  margin?: boolean
  size?: number
  currencies: Currency[]
  separation?: number
}

const HigherLogo = styled(CurrencyLogo)<{ zIndex: number }>`
  z-index: ${({ zIndex }) => zIndex};
  margin-left: ${({ zIndex }) => (zIndex > 3 ? '0px' : '0px')};
  margin-right: ${({ zIndex }) => (zIndex > 3 ? '35px' : '20px')};
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number; zIndex: number; position: number }>`
  position: absolute;
  z-index: ${({ zIndex }) => zIndex};
  left: ${({ position }) => `${position}px`};
`

export default function MultipleLogo({ currencies, size = 16, margin = false, separation }: MultipleLogoProps) {
  const currenciesQty = currencies.length
  const logosSeparation = separation ?? 10
  return (
    <Wrapper sizeraw={size} margin={margin}>
      <HigherLogo currency={currencies[0]} size={size.toString() + 'px'} zIndex={currenciesQty} />
      {currencies.slice(1).map((currency, index) => (
        <CoveredLogo
          key={currency.symbol}
          currency={currency}
          size={size.toString() + 'px'}
          sizeraw={size}
          zIndex={currenciesQty - index - 1}
          position={currenciesQty > 3 ? logosSeparation * (index + 1) : logosSeparation * (index + 1)}
        />
      ))}
    </Wrapper>
  )
}
