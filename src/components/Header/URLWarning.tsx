import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import useEmbeddedSwapUI from '../../hooks/useEmbeddedSwapUI'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 11px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()
  const { t } = useTranslation()
  const isEmbedded = useEmbeddedSwapUI()
  const isOnOurDomain = window.location.hostname.toLowerCase().endsWith('trisolaris.io')

  if (isMobile) {
    return (
      <PhishAlert isActive={showURLWarning}>
        <div style={{ display: 'flex' }}>
          <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.makeSureURLWarning')}
          <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>trisolaris.io</code>
        </div>
        <StyledClose size={12} onClick={toggleURLWarning} />
      </PhishAlert>
    )
  }

  if (isEmbedded || isOnOurDomain) {
    return (
      <PhishAlert isActive={showURLWarning}>
        <div style={{ display: 'flex' }}>
          <AlertTriangle style={{ marginRight: 6 }} size={12} /> {t('header.alwaysMakeSureWarning')}
          <code style={{ padding: '0 4px', display: 'inline', fontWeight: 'bold' }}>trisolaris.io</code> -{' '}
          {t('header.bookmarkIt')}
        </div>
        <StyledClose size={12} onClick={toggleURLWarning} />
      </PhishAlert>
    )
  }

  return null
}
