import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { TYPE } from '../../theme'
import { CardSection } from '../earn/styled'
import { DarkGreyCard } from '../Card'

type Props = {
    children: React.ReactNode,
    label: string,
}

export const StyledDataCard = styled(DarkGreyCard)`
    padding: 0;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 110px;
   `};
`

export default function StakeTriDataCard({
    children,
    label,
}: Props) {
    return (
        <StyledDataCard>
            <CardSection>
                <AutoColumn gap="md">
                    <AutoRow justify='center'>
                        <TYPE.black fontWeight={600}>{label}</TYPE.black>
                    </AutoRow>
                    {children}
                </AutoColumn>
            </CardSection>
        </StyledDataCard>
    )
}
