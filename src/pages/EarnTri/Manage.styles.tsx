import styled from 'styled-components'
import { Card } from 'rebass'

import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import { DarkGreyCard } from '../../components/Card'
import { DataCard } from '../../components/earn/styled'

export const PositionInfo = styled(AutoColumn)<{ dim: any }>`
  position: relative;
  width: 100%;
  opacity: ${({ dim }) => (dim ? 0.6 : 1)};
`

export const BottomSection = styled(AutoColumn)`
  border-radius: 12px;
  width: 100%;
  position: relative;
`

export const ResponsiveRowBetween = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`

export const StyledBottomCard = styled(DataCard)<{ dim: any }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  padding: 1rem 1.25rem;
`

export const PoolData = styled(DarkGreyCard)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 110px;
  text-align: center;
`};
`

export const Wrapper = styled(Card)`
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
`

export const BackgroundColor = styled.span<{ bgColor1: string | null; bgColor2?: string | null }>`
 background: ${({ theme, bgColor1, bgColor2 }) =>
   `linear-gradient(90deg, ${bgColor1 ?? theme.blue1} 0%, ${bgColor2 ?? 'grey'} 90%);`}
 background-size: cover;
 mix-blend-mode: overlay;
 border-radius: 10px;
 width: 100%;
 height: 100%;
 opacity: 0.5;
 position: absolute;
 top: 0;
 left: 0;
 user-select: none;
`

export const DataRow = styled(RowBetween)`
  justify-content: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
   gap: 12px;
 `};
`