import React from 'react'
import styled from 'styled-components'
import { DarkGreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import usePTRIRemittances from '../../hooks/usePTRIRemittances'
import { TYPE } from '../../theme'
import { addCommasToNumber } from '../../utils'

const Row = styled(AutoRow)`
  border-radius: 12px;
  justify-content: space-between;
  padding: 0.2rem 0.5rem;
  :nth-child(odd) {
    ${({ theme }) => `
      background-color: ${theme.bg3}
    `}
  }
`

export default function PTRIRemittances() {
  const remittanceData = usePTRIRemittances()
  return (
    <DarkGreyCard>
      <AutoColumn justify="center" gap="sm">
        <TYPE.largeHeader>Remittances</TYPE.largeHeader>
        <Row>
          <TYPE.main>Date</TYPE.main>
          <TYPE.main>USD Remitted</TYPE.main>
        </Row>
        {remittanceData.map(({ amount, timestamp }) => (
          <Row key={timestamp.valueOf()}>
            <TYPE.main>{timestamp.toLocaleDateString()}</TYPE.main>
            <TYPE.main>{addCommasToNumber(amount.toFixed(2))}</TYPE.main>
          </Row>
        ))}
      </AutoColumn>
    </DarkGreyCard>
  )
}
