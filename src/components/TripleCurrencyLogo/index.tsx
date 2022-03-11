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

interface TripleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  currency2?: Currency
}

const HigherLogo = styled(CurrencyLogo)`
  z-index: 4;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + (sizeraw / 2).toString() + 'px'} !important;
  z-index: 2;
`

const SecondCoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => '-' + sizeraw.toString() + 'px'} !important;
`

export default function TripleCurrencyLogo({
  currency0,
  currency1,
  currency2,
  size = 16,
  margin = false
}: TripleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <HigherLogo currency={currency0} size={size.toString() + 'px'} />}
      {currency1 && <CoveredLogo currency={currency1} size={size.toString() + 'px'} sizeraw={size} />}
      {currency2 && <SecondCoveredLogo currency={currency2} size={size.toString() + 'px'} sizeraw={size} />}
    </Wrapper>
  )
}
