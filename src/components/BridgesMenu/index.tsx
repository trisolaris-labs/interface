import React, { useRef } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'

import { StyledMenu, MenuFlyout } from '../StyledMenu'
import { ExternalLink } from '../../theme'
import { ButtonDropdown } from '../Button'

import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

const StyledMenuFlyout = styled(MenuFlyout)`
  min-width: 11rem;
  top: 3rem;
  right: unset;
  ${({ theme }) => theme.mediaWidth.upToLarge`
      right: 0.15rem;
`}
`

const activeClassName = 'ACTIVE'

const StyledExternalLink = styled(ExternalLink).attrs({
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

const MenuButton = styled(ButtonDropdown)`
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

export default function BridgesMenu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.BRIDGES_MENU)
  const toggle = useToggleModal(ApplicationModal.BRIDGES_MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <MenuButton onClick={toggle}>Bridges</MenuButton>

      {open && (
        <StyledMenuFlyout>
          <StyledExternalLink id="rainbow" href="https://rainbowbridge.app/transfer">
            Rainbow Bridge <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
          <StyledExternalLink id="terra" href="https://app.allbridge.io/bridge">
            Bridge from Terra <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
        </StyledMenuFlyout>
      )}
    </StyledMenu>
  )
}
