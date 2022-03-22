import React from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import LogoDark from '../../assets/svg/planets.svg'
import Menu from '../Menu'
import TriPriceModal from '../TriPriceModal'
import Web3Status from '../Web3Status'

import { useActiveWeb3React } from '../../hooks'

import useTriPrice from '../../hooks/useTriPrice'
import { useToggleTriPriceModal } from '../../state/application/hooks'

import {
  HeaderFrame,
  HeaderControls,
  HeaderElement,
  HeaderElementWrap,
  HeaderRow,
  HeaderLinks,
  AccountElement,
  TRIButton,
  TRIWrapper,
  Title,
  TRIIcon,
  StyledNavLink,
  IconWrapper,
  StyledHomeNavLink,
  HomeContainer,
  StyledBridgesMenu,
  StyledGovernanceMenu
} from './Header.styles'

export default function Header() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const { triPriceFriendly } = useTriPrice()

  const toggleTriPriceModal = useToggleTriPriceModal()

  return (
    <HeaderFrame>
      <HeaderRow>
        <HomeContainer>
          <Title id={`home-link`} to={'/'}>
            <TRIIcon>
              <img width={'24px'} src={LogoDark} alt="logo" />
            </TRIIcon>
          </Title>
          <StyledHomeNavLink id={`home-link`} to={'/'}>
            Trisolaris
          </StyledHomeNavLink>
        </HomeContainer>
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
          <StyledNavLink id={`xtri-nav-link`} to={'/stake'} isActive={Boolean}>
            {t('header.stake')}
          </StyledNavLink>
          <StyledNavLink
            id={`png-nav-link`}
            to={'/farm/1'}
            isActive={(match, { pathname }) => Boolean(match) || pathname.startsWith('/png')}
          >
            {t('header.farm')}
          </StyledNavLink>
          <StyledBridgesMenu />
          <StyledGovernanceMenu />
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <TRIWrapper active={true}>
            <TRIButton
              onClick={e => {
                e.currentTarget.blur()
                toggleTriPriceModal()
              }}
            >
              <IconWrapper size={16}>
                <img
                  src={
                    'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/assets/0xFa94348467f64D5A457F75F8bc40495D33c65aBB/logo.png'
                  }
                />
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
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
