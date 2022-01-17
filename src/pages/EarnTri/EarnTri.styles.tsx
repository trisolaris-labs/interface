import styled from 'styled-components'
import { darken } from 'polished'

import { SearchInput } from '../../components/SearchModal/styleds'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'

export const TopSection = styled(AutoColumn)`
  max-width: ${({ theme }) => theme.pageWidth};
  width: 100%;
`

export const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  justify-self: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  grid-template-columns: 1fr;
`};
`

export const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
 flex-direction: column;
`};
`

export const SortSection = styled.div`
  display: flex;
`
export const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`

export const SortFieldContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
 display: none;
`};
`

export const StyledSearchInput = styled(SearchInput)`
  border: 1px solid #1350ffb3;
  transition: border 50ms;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: flex-start;
  `};
`

export const StyledToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   margin-bottom: 1rem;
  `};
`

export const StyledSortContainer = styled.div``

export const StyledSortOption = styled.span`
  display: inline-flex;
  flex-direction: row;
  padding: 0 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  &:hover,
  &:focus,
  &:active {
    cursor: pointer;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledArrowContainer = styled.span`
  min-width: 1rem;
`
