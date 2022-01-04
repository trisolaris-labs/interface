import React, { useRef } from 'react'

import { StyledMenu } from '../StyledMenu'

import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import { StyledMenuFlyout, StyledExternalLink, MenuButton, StyledArrow } from './BridgesMenu.styles'

import { BRIDGES } from './BridgesMenu.constants'

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
          {BRIDGES.map(bridge => (
            <StyledExternalLink key={bridge.id} id={bridge.id} href={bridge.link}>
              {bridge.label} <StyledArrow>↗</StyledArrow>
            </StyledExternalLink>
          ))}
        </StyledMenuFlyout>
      )}
    </StyledMenu>
  )
}
