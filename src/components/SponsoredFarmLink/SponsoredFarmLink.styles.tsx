import styled from 'styled-components'
import { darken } from 'polished'

import { ExternalLink } from '../../theme'

export const StyledExternalLink = styled(ExternalLink)`
  z-index: 1;
  text-decoration: underline;
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
  font-size: 0.7rem;
  margin: 0;
  position: absolute;
  top: 4.5px;
  left: 70px;

  :active {
    text-decoration: underline;
  }

  :hover {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    left:55px;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    left:45px;
  `};
  ${({ theme }) => theme.mediaWidth.upToXxSmall`
    left: 12px;
  `};
`
