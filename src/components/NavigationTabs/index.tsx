import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink, useHistory } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme, color }) => color || theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme, color }) => color || theme.text1};
    ${({ color }) =>
      color &&
      `text-decoration: underline;
       text-underline-offset: 3px;`}
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function PoolTabs({ active }: { active: '/pool/stable' | '/pool' }) {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <Tabs>
      <StyledNavLink color={theme.yellow2} id={`pool-nav-link`} to={'/pool'} isActive={() => active === '/pool'}>
        Standard AMM
      </StyledNavLink>
      <StyledNavLink
        id={`stableswap-pool-nav-link`}
        to={'/pool/stable'}
        isActive={() => active === '/pool/stable'}
        color={theme.metallicGold}
      >
        Stable AMM
      </StyledNavLink>
    </Tabs>
  )
}

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '20px', display: 'none' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('navigationTabs.swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('navigationTabs.pool')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('navigationTabs.importPool')} </ActiveText>
        <QuestionHelper text={t('navigationTabs.useThisTool')} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  const { t } = useTranslation()
  const history = useHistory()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink
          to="#"
          onClick={e => {
            e.preventDefault()
            if (history.length > 0) {
              history.goBack()
            } else {
              history.push('/pool')
            }
          }}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {creating
            ? t('navigationTabs.createPair')
            : adding
            ? t('navigationTabs.addLiquidity')
            : t('navigationTabs.removeLiquidity')}
        </ActiveText>
        <QuestionHelper
          text={adding ? t('navigationTabs.whenYouAddLiquidityInfo') : t('navigationTabs.removingPoolTokensInfo')}
        />
      </RowBetween>
    </Tabs>
  )
}
