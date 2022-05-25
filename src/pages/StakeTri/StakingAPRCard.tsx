import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { HighlightCard, CardSection } from '../../components/earn/styled'
import { useTriBarStats } from '../../state/stakeTri/hooks'
import { useFetchTriBarAPR } from '../../fetchers/bar'

const Card = styled(HighlightCard)`
  background: none;
  border: none;
`

export const CardBackground = styled.span`
  background: rgb(0, 20, 255);
  background: linear-gradient(
    90deg,
    rgba(0, 20, 255, 1) 0%,
    rgba(0, 131, 255, 1) 21%,
    rgba(19, 156, 255, 1) 36%,
    rgba(49, 188, 247, 1) 50%,
    rgba(19, 156, 255, 1) 64%,
    rgba(0, 131, 255, 1) 79%,
    rgba(0, 20, 255, 1) 100%
  );
  background-size: cover;
  mix-blend-mode: overlay;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`

export default function StakingAPRCard() {
  const { xtriToTRIRatio } = useTriBarStats()
  const apr = useFetchTriBarAPR()

  const xtriToTRIRatioFormatted = xtriToTRIRatio?.toFixed(6)
  const ratioText = xtriToTRIRatioFormatted == null ? 'Loading...' : `1 xTRI = ${xtriToTRIRatioFormatted} TRI`

  return (
    <Card>
      <CardBackground />
      <CardSection>
        <AutoColumn gap="md">
          <RowBetween>
            <AutoColumn gap="sm" justify="start">
              <TYPE.mediumHeader color="white" fontWeight={600}>
                Staking APR
              </TYPE.mediumHeader>
              <TYPE.subHeader color="white">{ratioText}</TYPE.subHeader>
            </AutoColumn>
            <AutoColumn gap="sm" justify="end">
              <TYPE.largeHeader color="white">{apr == null ? 'Loading...' : `${apr?.toFixed(2)}%`}</TYPE.largeHeader>
              <TYPE.subHeader color="white">Yesterday's APR</TYPE.subHeader>
            </AutoColumn>
          </RowBetween>
        </AutoColumn>
      </CardSection>
    </Card>
  )
}
