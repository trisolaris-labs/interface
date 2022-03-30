import React, { useRef } from 'react'

import { StyledMenu } from '../StyledMenu'

import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import { StyledMenuFlyout, StyledExternalLink, MenuButton, StyledArrow } from '../BridgesMenu/BridgesMenu.styles'

import { GOVERNANCE } from './GovernanceMenu.constants'

export default function GovernanceMenu({ ...rest }) {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.GOVERNANCE_MENU)
  const toggle = useToggleModal(ApplicationModal.GOVERNANCE_MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any} {...rest}>
      <MenuButton onClick={toggle}>
        <span>Governance</span>
      </MenuButton>

      {open && (
        <StyledMenuFlyout>
          {GOVERNANCE.map(governance => (
            <StyledExternalLink key={governance.id} id={governance.id} href={governance.link}>
              {governance.label} <StyledArrow>↗</StyledArrow>
            </StyledExternalLink>
          ))}
        </StyledMenuFlyout>
      )}
    </StyledMenu>
  )
}
