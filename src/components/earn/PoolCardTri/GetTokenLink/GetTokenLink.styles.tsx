import styled from 'styled-components'
import { darken } from 'polished'

import { ExternalLink } from '../../../../theme'

export const StyledExternalLink = styled(ExternalLink)`
  z-index: 1;
  text-decoration: underline;
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
  font-size: 0.85rem;
  margin: 0;
  position: absolute;
  top: 58px;
  right: 18px;

  :active {
    text-decoration: underline;
  }

  :hover {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
  right:10px;
`};
`
