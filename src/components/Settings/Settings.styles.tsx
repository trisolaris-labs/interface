import styled from 'styled-components'
import { Settings, X } from 'react-feather'

import { MenuFlyout } from '../StyledMenu'

export const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;

  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

export const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

export const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

export const SettingsMenuFlyout = styled(MenuFlyout)`
  top: 3rem;
  border: ${({ theme }) => `1px solid ${theme.bg3}`};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
    right: 0.15rem;
  `};
`
