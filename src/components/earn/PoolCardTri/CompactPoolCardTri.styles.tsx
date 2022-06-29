import styled from 'styled-components'
import { AutoColumn } from '../../Column'

import { Wrapper, StyledActionsContainer, PairContainer } from './PoolCardTri.styles'

export const CompactWrapper = styled(Wrapper)`
  display: flex;
`

export const CompactActionsContainer = styled(StyledActionsContainer)`
  min-width: 110px;
  justify-content: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:2;
  `};
`

export const CompactPairContainer = styled(PairContainer)`
  min-width: 200px;
  max-width: 200px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:1;
  `};
`

export const StakedContainer = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:3;
  margin-top:15px;
  `};
`

export const AprContainer = styled(AutoColumn)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  order:4;
  margin-top:15px;
  `};
`
