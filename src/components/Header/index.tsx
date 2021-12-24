import React from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken, lighten } from 'polished'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/planets.svg'
import LogoDark from '../../assets/svg/planets.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { ExternalLink } from '../../theme'
import { ButtonSecondary } from '../Button'

import { RedCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import { NETWORK_LABELS } from '../../constants'
import LanguageSelection from '../LanguageSelection'
import useTriPrice from '../../hooks/useTriPrice'
import { useToggleTriPriceModal } from '../../state/application/hooks'
import TriPriceModal from '../TriPriceModal'

const HeaderFrame = styled.div`
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
  padding: 1rem;
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

const HeaderControls = styled.div`
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

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
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

const TRIButton = styled(ButtonSecondary) <{ isDark: boolean }>`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  border: ${({ theme }) => `1px solid ${theme.bg3}`};
  background: ${({ theme, isDark }) => {
    const color1 = isDark ? darken(0.08, theme.blue1) : lighten(0.08, theme.blue1);
    const color2 = isDark ? darken(0.08, '#e84142') : '#e84142';
    return `radial-gradient(174.47% 188.91% at 1.84% 0%, ${color1} 0%, ${color2} 100%), ${theme.white}`;
  }};

  &:hover, &:focus, &:active {
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.primary3};
    background: ${({ theme, isDark }) => {
      const color1 = isDark ? darken(0.12, theme.blue1) : lighten(0.12, theme.blue1);
      const color2 = isDark ? darken(0.12, '#e84142') : '#e84142';
      return `radial-gradient(174.47% 188.91% at 1.84% 0%, ${color1} 0%, ${color2} 100%), ${theme.white}`;
    }};
  }
  `

const TRIWrapper = styled(AccountElement) <{ isDark: boolean }>`
  color: white;
  padding: 4px 0;
  height: 36px;
  font-weight: 500;
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(RedCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const Title = styled.a`
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

const TRIIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
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
  margin: 0 12px;
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
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const [isDark] = useDarkModeManager()
  const { triPriceFriendly } = useTriPrice();

  const toggleTriPriceModal = useToggleTriPriceModal();

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href=".">
          <TRIIcon>
            <img width={'24px'} src={isDark ? LogoDark : Logo} alt="logo" />
          </TRIIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            {t('header.swap')}
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/create') ||
              pathname.startsWith('/find')
            }
          >
            {t('header.pool')}
          </StyledNavLink>
          <StyledNavLink
            id={`xtri-nav-link`}
            to={'/stake'}
            isActive={Boolean}
          >
            {t('header.stake')}
          </StyledNavLink>
          <StyledNavLink
            id={`png-nav-link`}
            to={'/farm/1'}
            isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/png')}
          >
            {t('header.farm')}
          </StyledNavLink>
          <StyledExternalLink id="aurora-bridge" href={'https://rainbowbridge.app/transfer'}>
            Rainbow Bridge <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
          <StyledExternalLink id="terra-bridge" href={'https://app.allbridge.io/bridge'}>
            Bridge from Terra <span style={{ fontSize: '11px' }}>↗</span>
          </StyledExternalLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
            <TRIWrapper active={true} isDark={isDark}>
              <TRIButton isDark={isDark} onClick={(e) => {
                e.currentTarget.blur();
                toggleTriPriceModal();
              }}>
                <IconWrapper size={16}>
                  <img src={'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/0xFa94348467f64D5A457F75F8bc40495D33c65aBB/logo.png'} />
                </IconWrapper>
                <Text style={{ flexShrink: 0 }} pl="0.75rem" fontWeight={500}>
                  {triPriceFriendly != null ? `$${triPriceFriendly}` : '-'}
                </Text>
              </TRIButton>
              <TriPriceModal />
            </TRIWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
