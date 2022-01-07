import styled from 'styled-components'
import { darken } from 'polished'

import { MenuFlyout } from '../StyledMenu'
import { ExternalLink } from '../../theme'
import { ButtonDropdown } from '../Button'

const activeClassName = 'ACTIVE'

export const StyledMenuFlyout = styled(MenuFlyout)`
  top: 3rem;
  right: unset;
  ${({ theme }) => theme.mediaWidth.upToLarge`
      right: 0.15rem;
`}
  min-width: fit-content;
  white-space: nowrap;
`

export const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  margin: 8px;
  font-weight: 500;
  justify-content: space-between;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const MenuButton = styled(ButtonDropdown)`
  padding: 0px;
  background: transparent;
  text-decoration: none;
  :hover,
  :focus,
  :active {
    background: none;
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
    box-shadow: none;
  }
  margin: 0px 4px;
`

export const StyledArrow = styled.span`
  font-size: 11px;
  margin-left: 0.3rem;
`

export const StyledButtonText = styled.span`
  ${({ theme }) => theme.mediaWidth.upToXxxSmall`
    display: none;
  `}
`
