import styled from 'styled-components'
import { darken } from 'polished'

import Tooltip from '../Tooltip'
import { Text } from 'rebass'

export const StyledAddressContainer = styled.div`
  display: flex;
  align-items: center;
`

export const StyledContractButton = styled.button`
  z-index: 1;
  border: none;
  height: 28px;
  width: 28px;
  background-color: ${({ theme }) => theme.bg6};
  border-radius: 100%;
  color: ${({ theme }) => theme.text1};

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => darken(0.1, theme.bg6)};
  }

  svg {
    margin-top: 2px;
  }
`

export const StyledTooltip = styled(Tooltip)`
  width: fit-content;
  min-width: 190px;
  font-size: 0.75rem;
  text-align: center;
`

export const StyledText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  margin-right: 10px;
`
