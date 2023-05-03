import React, { useRef } from 'react'
import { MessageCircle, Send, Twitter, GitHub, Book } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { StyledMenu, StyledMenuButton, MenuFlyout, MenuItem } from '../StyledMenu'

import { useTranslation } from 'react-i18next'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const NarrowMenuFlyout = styled(MenuFlyout)`
  min-width: 8.125rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  const { t } = useTranslation()
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <NarrowMenuFlyout>
          <MenuItem id="link" href="https://github.com/trisolaris-labs">
            <GitHub size={14} />
            {t('menu.code')}
          </MenuItem>
          <MenuItem id="link" href="https://trisolaris-labs.github.io/docs/">
            <Book size={14} />
            {t('Docs')}
          </MenuItem>
          <MenuItem id="link" href="https://t.me/TrisolarisLabs">
            <Send size={14} />
            {t('menu.telegram')}
          </MenuItem>
          <MenuItem id="link" href="http://discord.gg/my6GtSTmmX">
            <MessageCircle size={14} />
            {t('menu.discord')}
          </MenuItem>
          <MenuItem id="link" href="https://twitter.com/trisolarislabs">
            <Twitter size={14} />
            {t('menu.twitter')}
          </MenuItem>
        </NarrowMenuFlyout>
      )}
    </StyledMenu>
  )
}
