import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { darken } from 'polished'

import { ButtonSecondary } from '../Button'
import Row, { RowFixed } from '../Row'
import BridgesMenu from '../BridgesMenu'
import GovernanceMenu from '../GovernanceMenu'

const responsiveTextAndMargin = css`
  margin: 0 12px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
margin: 0 5px;
font-size: 0.925rem;
`};

  ${({ theme }) => theme.mediaWidth.upToXxSmall`
margin: 0 4px;
font-size: 0.85rem;
`};

  ${({ theme }) => theme.mediaWidth.upToXxxSmall`
font-size: 0.75rem;
`};
`

export const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem 1rem 1rem;
  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  grid-template-columns: 1fr;
  padding: 0 1rem;
  width: calc(100%);
  position: relative;
`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 0.5rem 1rem;
`}
`

export const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: row;
  justify-content: space-between;
  justify-self: center;
  width: 100%;
  max-width: 960px;
  padding: 1rem;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  z-index: 99;
  height: 72px;
  border-radius: 12px 12px 0 0;
  background-color: ${({ theme }) => theme.bg1};
`};
`

export const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
 flex-direction: row-reverse;
  align-items: center;
`};
`

export const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`

export const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
 width: 100%;
`};
`

export const HeaderLinks = styled(Row)`
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 1rem 0 1rem 1rem;
  justify-content: flex-end;
`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 1rem 0;
  justify-content: center;
`}
`

export const AccountElement = styled.div<{ active: boolean }>`
display: flex;
flex-direction: row;
align-items: center;
border-radius: 12px;
white-space: nowrap;
width: 100%;
cursor: pointer;

:focus {
  border: 1px solid blue;
}
/* :hover {
  background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
} */
`

export const TRIButton = styled(ButtonSecondary)`
color: white;
padding: 4px 8px;
height: 36px;
font-weight: 500;
border: none;
background: ${({ theme }) => theme.primary1}
&:hover, &:focus, &:active {
  border: none;
  box-shadow: none;
  background: ${({ theme }) => darken(0.12, theme.primary1)}
}
`

export const TRIWrapper = styled(AccountElement)`
  color: white;
  padding: 4px 0;
  height: 36px;
  font-weight: 500;
`

export const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-self: center;
`};
  :hover {
    cursor: pointer;
  }
`

export const TRIIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

export const activeClassName = 'ACTIVE'

export const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
  ${responsiveTextAndMargin};
`

export const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

export const StyledHomeNavLink = styled(StyledNavLink)`
  margin: 0 0 0 0.25rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display:none;
`};
`

export const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-right:0;
`};
`

export const StyledBridgesMenu = styled(BridgesMenu)`
  ${responsiveTextAndMargin};
`

export const StyledGovernanceMenu = styled(GovernanceMenu)`
  ${responsiveTextAndMargin};
`
