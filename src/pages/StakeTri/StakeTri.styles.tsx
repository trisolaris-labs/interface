import styled from 'styled-components'

import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { ClickableText } from '../Pool/styleds'
import { TYPE } from '../../theme'

export const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
   flex-direction: column;
   margin: 15px;
 `};
`

export const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

export const StakeClickableText = styled(ClickableText)<{ selected: boolean }>`
  color: ${({ selected, theme }) => (selected ? theme.primary1 : theme.bg5)};
  font-weight: ${({ selected }) => (selected ? 500 : 400)};
`

export const LargeHeaderWhite = styled(TYPE.largeHeader)`
  color: white;
`
