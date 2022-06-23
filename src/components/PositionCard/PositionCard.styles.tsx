import styled from 'styled-components'
import { darken } from 'polished'

import { RowBetween } from '../Row'
import Card, { LightCard } from '../Card'
import { ButtonEmpty } from '../Button'

export const ManageButton = styled(ButtonEmpty)`
  color: ${({ theme }) => theme.white};
`

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
export const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  background-color: unset;
  border: none;
  position: relative;
  overflow: hidden;
`
