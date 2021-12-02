import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { CardSection } from '../earn/styled'

type Props = {
    children: React.ReactNode,
    label: string,
}

const DataColumn = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: row;
 `};
 `

export const StyledDataCard = styled(AutoColumn)`
   border: 1px solid black
   border-radius: 12px;
   width: 100%;
   position: relative;
   overflow: hidden;
 `
export default function StakeTriDataCard({
    children,
    label,
}: Props) {
    return (
        <DataColumn style={{ alignItems: 'baseline' }}>
            <StyledDataCard>
                <CardSection>
                    <AutoColumn gap="md">
                        <RowBetween>
                            <TYPE.black fontWeight={600}>{label}</TYPE.black>
                        </RowBetween>
                        {children}
                    </AutoColumn>
                </CardSection>
            </StyledDataCard>
        </DataColumn>
    )
}
