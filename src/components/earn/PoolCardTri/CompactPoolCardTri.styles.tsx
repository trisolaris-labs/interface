import styled from 'styled-components'

import { Wrapper, StyledActionsContainer, PairContainer } from './PoolCardTri.styles'

export const CompactWrapper = styled(Wrapper)`
  display: flex;
`

export const CompactActionsContainer = styled(StyledActionsContainer)`
  min-width: 110px;
`

export const CompactPairContainer = styled(PairContainer)`
  min-width: 200px;
  max-width: 200px;
`
