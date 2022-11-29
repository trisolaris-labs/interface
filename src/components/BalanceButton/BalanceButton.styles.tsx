import styled from 'styled-components'

import { ButtonSecondary } from '../Button'
import { RowFlat } from '../Row'

const StyledBalanceButton = styled(ButtonSecondary)`
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  padding: 4px 4px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.primaryText1};
  height: 100%;

  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
    box-shadow: none;
  }
  :active {
    box-shadow: 0 0 0 1pt #1350ff;
  }
  :focus-visible {
    box-shadow: 0 0 0 1pt #1350ff;
  }
`

export const StyledBalanceLeftButton = styled(StyledBalanceButton)`
  border-top-left-radius: 0.5rem;
  border-top-right-radius: unset;
  border-bottom-right-radius: unset;
  border-bottom-left-radius: 0.5rem;
  margin-right: 0.1rem;
`

export const StyledBalanceRightButton = styled(StyledBalanceButton)`
  border-top-left-radius: unset;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: unset;
`

export const StyledRowFlat = styled(RowFlat)`
  margin-left: 4px;
  height: 16px;
`
