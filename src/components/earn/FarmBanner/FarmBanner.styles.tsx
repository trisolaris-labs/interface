import styled from 'styled-components'

import Card from '../../Card'
import { AutoColumn } from '../../Column'

export const StyledCard = styled(Card)`
  background: ${({ theme }) => `radial-gradient(farthest-corner at 0% 0%, ${theme.primary1} 0%, transparent 70%)`};
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
`

export const IconContainer = styled.div`
  max-height: 170px;
  max-width: 240px;
  overflow: hidden;
  & > * {
    object-position: 16px 16px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
      max-height: 90px;
      & > * {
          height: 200px;
          width: 150px;
          object-position: 24px 16px;
      }
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display:none;
`};
`

export const StyledSummaryHeader = styled.span`
  font-weight: 500;
`

export const StyledTokensContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  flex-wrap: wrap;
`

export const StyledTokenHeader = styled.span`
  font-weight: 600;
`

export const StyledAutoColumn = styled(AutoColumn)`
  padding-top: 1rem;
  flex: 1;
  max-width: 60%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      max-width: 100%;
      padding-right :0.5rem;
`};
`

export const StyledToken = styled.div`
  flex: 1 1 10%;
  margin-right: 1rem;
`
